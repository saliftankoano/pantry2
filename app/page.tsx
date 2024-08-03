"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
//Firebase
import {
  doc,
  setDoc,
  collection,
  getDocs,
  Timestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, app } from "../firebaseConfig";
import defaultProd from "../assets/defaultprod.webp";
//Toast
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import ReactiveButton from "reactive-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
// Define an interface for the pantry item structure
interface PantryItem {
  productName: string;
  quantity: number;
  addedOn: string;
  expiresOn: string;
}
// Define the type for a single recipe
type Recipe = {
  id: number;
  title: string;
  image: string;
  missedIngredients: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }>;
};
//Radix UI

const spooncularKey = process.env.NEXT_PUBLIC_SPOOCULAR_KEY;

export default function Dashboard() {
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [buttonState, setButtonState] = useState("idle");
  const [showRecipes, setShowRecipes] = useState(false);
  // Pantry product variables
  const [productName, setProductName] = useState<string>("");
  const [addedOn, setAddedOn] = useState<Date>();
  const [expiresOn, setExpiresOn] = useState<Date>();
  // Edit Dialog variables
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [quantity, setQuantity] = useState(editingItem?.quantity || 0);
  const [search, setSearch] = useState("");
  const productNames: string[] = [];
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const { toast } = useToast();
  const generateRecipes = async () => {
    try {
      setButtonState("loading");
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const querySnapshot = await getDocs(collection(db, "pantry"));
      const allProducts = querySnapshot.docs;

      allProducts.forEach((product) => {
        productNames.push(product.data().productName);
      });
      const ingredients = productNames.join(",");

      const getRecipes = async () => {
        try {
          //Minimize missing ingredients
          const response = await fetch(
            `https://api.spoonacular.com/recipes/findByIngredients?ranking=2&ingredients=${ingredients}&number=9&apiKey=${spooncularKey}`
          );
          const responseData = await response.json();
          console.log(responseData);
          setRecipes(responseData);
        } catch (error) {
          console.log(error);
        }
      };

      getRecipes();

      setShowRecipes(true);
      setButtonState("success");
      setTimeout(() => setButtonState("idle"), 3000);
    } catch (error) {
      setButtonState("error");
      setTimeout(() => setButtonState("idle"), 3000);
    }
  };
  useEffect(() => {
    if (editingItem) {
      setQuantity(editingItem.quantity || 0);
    }
  }, [editingItem]);
  const editProduct = async (
    product: string,
    newQuantity: Number,
    addedOn: Date,
    expiresOn: Date
  ) => {
    try {
      const docRef = doc(db, "pantry", product);

      // Update the quantity field
      await updateDoc(docRef, {
        addedOn: addedOn,
        expiresOn: expiresOn,
        quantity: newQuantity,
      });
      updatePantry();
      console.log(`Document ${product} successfully updated!`);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  const openEdit = (item: PantryItem) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setEditingItem(null);
    setIsEditOpen(false);
  };
  // Delete Dialog variables
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<PantryItem | null>(null);
  const openDelete = (item: PantryItem) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };
  const closeDelete = () => {
    setDeletingItem(null);
    setIsDeleteOpen(false);
  };
  const deleteConfirmed = async (product: string) => {
    try {
      await deleteDoc(doc(db, "pantry", product));
      updatePantry();
      toast({
        title: `Product Deleted!`,
        description: `${product} has been successfully added`,
        action: (
          <ToastAction altText="Goto schedule to undo">Dismiss</ToastAction>
        ),
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  const updatePantry = async () => {
    const querySnapshot = await getDocs(collection(db, "pantry"));
    const allEntries = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        addedOn:
          data.addedOn instanceof Timestamp
            ? data.addedOn.toDate().toLocaleDateString()
            : data.addedOn,
        expiresOn:
          data.expiresOn instanceof Timestamp
            ? data.expiresOn.toDate().toLocaleDateString()
            : data.expiresOn,
      } as PantryItem;
    });
    setPantry(allEntries);
  };
  const addProduct = async () => {
    // Add a new document in collection "pantry"
    try {
      await setDoc(doc(db, "pantry", `${productName}`), {
        productName: productName,
        quantity: quantity,
        addedOn: addedOn,
        expiresOn: expiresOn,
      });
      setQuantity(0);
      updatePantry();
      toast({
        title: `New Product Added!`,
        description: `${productName} was succesfully added.`,
        action: (
          <ToastAction altText="Goto schedule to undo">Dismiss</ToastAction>
        ),
      });
    } catch (error) {}
  };

  useEffect(() => {
    updatePantry();
  }, []);
  /* Next Steps
   * Take pictures with mobile or web camera
   * Classify images using OpenAi vision API and update firebase
   */
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Orders</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Orders</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Package className="h-5 w-5" />
                <span className="sr-only">Products</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Products</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Users2 className="h-5 w-5" />
                <span className="sr-only">Customers</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Customers</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LineChart className="h-5 w-5" />
                <span className="sr-only">Analytics</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Analytics</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/placeholder-user.jpg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="recipes">Recipes</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 bg-black text-white hover:bg-[#262626]  hover:text-white"
                    >
                      <PlusCircle className="h-3.5 w-3.5 text-white" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Product</DialogTitle>
                      <DialogDescription>
                        What are you adding today?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product" className="text-right">
                          Product
                        </Label>
                        <Input
                          id="product"
                          placeholder="Banana"
                          className="col-span-3"
                          required
                          value={productName as string}
                          onChange={(e) => {
                            setProductName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                          Quantity
                        </Label>
                        <Input
                          className="col-span-3"
                          id="quantity"
                          type="number"
                          required
                          defaultValue="1"
                          min="1"
                          onChange={(e) => {
                            setQuantity(e.target.valueAsNumber);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center ml-[25%]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !addedOn && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {addedOn ? (
                                format(addedOn, "PPP")
                              ) : (
                                <span>Added on</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              required
                              selected={addedOn}
                              onSelect={setAddedOn}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="grid grid-cols-4 items-center ml-[25%]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !expiresOn && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {expiresOn ? (
                                format(expiresOn, "PPP")
                              ) : (
                                <span>Expires on</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              required
                              selected={expiresOn}
                              onSelect={setExpiresOn}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose>
                        <Button type="submit" onClick={addProduct}>
                          Add To Fridge
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    Manage your fridge and avoid waisting your money.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Added on
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Expires on
                        </TableHead>

                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pantry
                        .filter((item) => {
                          return search.toLowerCase() === ""
                            ? item
                            : item.productName.toLowerCase().includes(search);
                        })
                        .map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="hidden sm:table-cell">
                              <Image
                                alt="Product image"
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src={defaultProd}
                                width="64"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.productName}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.quantity}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {item.addedOn}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {item.expiresOn}
                            </TableCell>
                            <TableCell className="hidden md:table-cell"></TableCell>
                            <TableCell>
                              <DropdownMenu key={index}>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />

                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => openEdit(item)}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openDelete(item)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <Dialog
                                key={`edit-dialog-${index}`}
                                open={isEditOpen && editingItem === item}
                                onOpenChange={(isOpen) => {
                                  if (!isOpen) closeEdit();
                                }}
                              >
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Product</DialogTitle>
                                    <DialogDescription>
                                      Modify the {item.productName} details.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center ml-[25%]">
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-[280px] justify-start text-left font-normal",
                                              !addedOn &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {addedOn ? (
                                              format(addedOn, "PPP")
                                            ) : (
                                              <span>Added on</span>
                                            )}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                          <Calendar
                                            mode="single"
                                            required
                                            selected={addedOn}
                                            onSelect={setAddedOn}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                    <div className="grid grid-cols-4 items-center ml-[25%]">
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-[280px] justify-start text-left font-normal",
                                              !expiresOn &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {expiresOn ? (
                                              format(expiresOn, "PPP")
                                            ) : (
                                              <span>Expires on</span>
                                            )}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                          <Calendar
                                            mode="single"
                                            required
                                            selected={expiresOn}
                                            onSelect={setExpiresOn}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label
                                        htmlFor="quantity"
                                        className="text-right"
                                      >
                                        Quantity
                                      </Label>
                                      <Input
                                        id="quantity"
                                        type="number"
                                        required
                                        value={quantity}
                                        onChange={(e) => {
                                          setQuantity(e.target.valueAsNumber);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button
                                        onClick={() => {
                                          editProduct(
                                            item.productName,
                                            quantity,
                                            addedOn as Date,
                                            expiresOn as Date
                                          );

                                          updatePantry();
                                          closeEdit();
                                        }}
                                      >
                                        Save Changes
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog
                                key={`delete-dialog-${index}`}
                                open={isDeleteOpen && deletingItem === item}
                                onOpenChange={setIsDeleteOpen}
                              >
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete the {item.productName}.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={closeDelete}>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        deleteConfirmed(item.productName)
                                      }
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    products
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="recipes">
              <Card x-chunk="recipes-card">
                <CardHeader>
                  <CardTitle>Recipes</CardTitle>
                  <CardDescription>
                    Find a delicious recipe today!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReactiveButton
                    buttonState={buttonState}
                    onClick={generateRecipes}
                    animation={true}
                    color="violet"
                    size="large"
                    idleText="Find Recipes"
                    loadingText="Generating...🤤"
                    successText={
                      <>
                        <FontAwesomeIcon icon={faCheck} /> Success
                      </>
                    }
                    errorText="Oops 🫤"
                    disabled={false}
                  />
                  {recipes.length > 0 && showRecipes && (
                    <div className="flex flex-wrap justify-evenly">
                      {recipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="mt-8 p-2 border-gray-300 border-[1px] sm:w-full md:w-full lg:w-[30%]"
                        >
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            style={{
                              display: "block",
                              objectFit: "cover",
                              width: "100%",
                              maxHeight: 200,
                              backgroundColor: "var(--gray-5)",
                            }}
                          />
                          <div className="text-lg font-[600] pt-2">
                            {recipe.title}
                          </div>
                          <Separator className="my-2 bg-black" />
                          <div className="text-md p-2">Missing ingredients</div>
                          <div className="flex flex-wrap missing-ingredients">
                            {recipe.missedIngredients.map((ingredient) => (
                              <Badge
                                className="p-2"
                                variant="outline"
                                key={ingredient.id}
                              >
                                {ingredient.original}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
