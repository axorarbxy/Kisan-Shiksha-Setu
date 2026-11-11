"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField as UIFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ConfirmDialog,
  DataTable,
  EmptyState,
  FormField,
  Logo,
  PageHeader,
  PageSkeleton,
  RoleBadge,
  Spinner,
  StatCard,
} from "@/components/shared";
import { useForm } from "react-hook-form";
import { CalendarPreview } from "@/app/(public)/design/calendar-preview";

type MentorRow = {
  name: string;
  school: string;
  sessions: number;
};

const mentorRows: MentorRow[] = [
  { name: "Asha Patel", school: "Green Valley School", sessions: 18 },
  { name: "Ravi Kumar", school: "Riverbank College", sessions: 12 },
];

export function ComponentsShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);
  const form = useForm({ defaultValues: { name: "Asha Patel", bio: "" } });
  const columns = useMemo(
    () => [
      {
        id: "name",
        header: "Mentor",
        cell: (row: MentorRow) => row.name,
        sortValue: (row: MentorRow) => row.name,
      },
      {
        id: "school",
        header: "School",
        cell: (row: MentorRow) => row.school,
        sortValue: (row: MentorRow) => row.school,
      },
      {
        id: "sessions",
        header: "Sessions",
        cell: (row: MentorRow) => row.sessions,
        sortValue: (row: MentorRow) => row.sessions,
      },
    ],
    [],
  );

  return (
    <div className="space-y-12">
      <section aria-labelledby="shared-heading" className="space-y-5">
        <h2
          className="text-foreground text-xl font-semibold"
          id="shared-heading"
        >
          Shared components
        </h2>
        <div className="border-border bg-card flex flex-wrap items-center gap-6 rounded-xl border p-6">
          <Logo />
          <RoleBadge role="mentor" />
          <RoleBadge role="school" />
          <RoleBadge role="college-admin" />
          <Spinner />
        </div>
        <PageHeader
          title="Page header"
          description="Page title, supporting description, and an optional actions slot."
          actions={<Button variant="outline">Header action</Button>}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <StatCard
            label="Active learners"
            value="1,284"
            delta="Up 12% this month"
          />
          <StatCard
            highlight
            label="New placements"
            value="36"
            delta="Highlighted metric"
          />
        </div>
        <EmptyState
          action={<Button variant="outline">Explore mentors</Button>}
          description="When new opportunities become available, they will appear here."
          title="A fresh start"
        />
        <div className="space-y-4">
          <h3 className="text-foreground text-base font-medium">
            Sortable data table
          </h3>
          <DataTable
            columns={columns}
            data={mentorRows}
            getRowKey={(row) => row.name}
          />
          <DataTable
            columns={columns}
            data={[]}
            getRowKey={(row) => row.name}
            loading
            loadingRows={2}
          />
        </div>
        <Button onClick={() => setConfirmOpen(true)} variant="outline">
          Open confirm dialog
        </Button>
        <ConfirmDialog
          cancelLabel="Keep"
          confirmLabel="Remove"
          description="This action cannot be undone."
          onConfirm={() => setConfirmOpen(false)}
          onOpenChange={setConfirmOpen}
          open={confirmOpen}
          title="Remove this mentor?"
        />
        <PageSkeleton />
      </section>

      <section aria-labelledby="primitives-heading" className="space-y-5">
        <h2
          className="text-foreground text-xl font-semibold"
          id="primitives-heading"
        >
          shadcn/ui primitives
        </h2>

        <Card>
          <CardHeader>
            <CardTitle>Buttons, badges, and avatar</CardTitle>
            <CardDescription>
              Keyboard-focusable controls show a visible purple focus ring.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="accent">Accent CTA</Button>
            <Button disabled>Disabled</Button>
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Avatar>
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form controls</CardTitle>
            <CardDescription>
              Inputs, labels, selection, and validation.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="demo-name">Name</Label>
              <Input defaultValue="Asha Patel" id="demo-name" />
              <Input disabled placeholder="Disabled input" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="demo-select">Role</Label>
              <Select defaultValue="mentor">
                <SelectTrigger id="demo-select">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                </SelectContent>
              </Select>
              <Select disabled>
                <SelectTrigger aria-label="Disabled selection">
                  <SelectValue placeholder="Disabled select" />
                </SelectTrigger>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="demo-bio">Textarea</Label>
              <Textarea id="demo-bio" placeholder="Add a short bio" />
              <Textarea disabled placeholder="Disabled textarea" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Checkbox id="demo-checkbox" />
                <Label htmlFor="demo-checkbox">Checkbox</Label>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Checkbox disabled id="demo-checkbox-disabled" />
                <Label htmlFor="demo-checkbox-disabled">
                  Disabled checkbox
                </Label>
              </div>
              <label
                className="flex items-center gap-3 text-sm"
                htmlFor="demo-switch"
              >
                <Switch
                  checked={switchOn}
                  id="demo-switch"
                  onCheckedChange={setSwitchOn}
                />
                Switch
              </label>
              <div className="flex items-center gap-3 text-sm">
                <Switch disabled id="demo-switch-disabled" />
                <Label htmlFor="demo-switch-disabled">Disabled switch</Label>
              </div>
              <RadioGroup defaultValue="mentor" aria-label="Role choice">
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="radio-mentor" value="mentor" />
                  <Label htmlFor="radio-mentor">Mentor</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="radio-school" value="school" />
                  <Label htmlFor="radio-school">School</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    disabled
                    id="radio-disabled"
                    value="disabled"
                  />
                  <Label htmlFor="radio-disabled">Disabled role</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="md:col-span-2">
              <Form {...form}>
                <form className="grid gap-4 sm:grid-cols-2">
                  <UIFormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>shadcn form field</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    label="Shared form field"
                    name="bio"
                    renderControl={(field, props) => (
                      <Input
                        {...field}
                        aria-describedby={props.describedBy}
                        aria-invalid={props.invalid}
                        id={props.id}
                        placeholder="Optional bio"
                      />
                    )}
                  />
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation, overlays, and feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Design</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger disabled value="disabled">
                  Disabled tab
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview">Overview tab content.</TabsContent>
              <TabsContent value="activity">Recent activity.</TabsContent>
            </Tabs>
            <div className="flex flex-wrap items-center gap-3">
              <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog primitive</DialogTitle>
                    <DialogDescription>
                      Dialogs support keyboard focus management and Escape to
                      close.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <h3 className="text-lg font-semibold">Sheet primitive</h3>
                </SheetContent>
              </Sheet>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Dropdown menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem disabled>Disabled item</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Popover</Button>
                </PopoverTrigger>
                <PopoverContent>Popover content.</PopoverContent>
              </Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>Helpful context</TooltipContent>
              </Tooltip>
              <Button
                onClick={() => toast.success("Saved successfully")}
                variant="outline"
              >
                Show toast
              </Button>
            </div>
            <Alert>
              <AlertTitle>Alert</AlertTitle>
              <AlertDescription>
                Important information is shown inline.
              </AlertDescription>
            </Alert>
            <Progress aria-label="Profile completeness" value={65} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar, command, table, and scroll area</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-2">
            <CalendarPreview />
            <div className="space-y-4">
              <Command className="border-border rounded-xl border">
                <CommandInput placeholder="Search commands..." />
                <CommandList>
                  <CommandEmpty>No commands found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>Find a mentor</CommandItem>
                    <CommandItem>View schools</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Asha Patel</TableCell>
                    <TableCell>Mentor</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <ScrollArea className="border-border h-24 rounded-lg border p-3">
                <p className="text-muted-foreground text-sm leading-7">
                  Scroll area content. This text repeats to demonstrate the
                  accessible, keyboard-focusable scrolling viewport. This text
                  repeats to demonstrate the scrolling viewport.
                </p>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sidebar, separator, skeleton, and loading</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <SidebarProvider className="border-border min-h-0 rounded-xl border">
              <Sidebar collapsible="none" className="w-full">
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton isActive>
                            Dashboard
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton>Mentors</SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </SidebarProvider>
            <Separator />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-40" />
              <span className="text-muted-foreground text-sm">Skeleton</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
