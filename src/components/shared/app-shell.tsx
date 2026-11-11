"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Fragment, useEffect, type ReactNode } from "react";
import { ChevronDown, LogOut, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/logo";
import { RoleBadge } from "@/components/shared/role-badge";
import { navByRole, roleHome, settingsNavItem } from "@/config/nav";
import type { NavItem, Role } from "@/config/nav";
import { useRoleStore } from "@/stores/role-store";
import { useDevSessionStore } from "@/stores/dev-session-store";

function getPathRole(pathname: string): Role | null {
  return getRole(pathname.split("/")[1]);
}

function getRole(value: string | undefined): Role | null {
  return value === "mentor" || value === "school" || value === "admin"
    ? value
    : null;
}

function getBreadcrumbLabel(path: string, role: Role) {
  if (path === "/settings") {
    return "Settings";
  }
  const navItem = [...navByRole[role], settingsNavItem].find(
    (item) => item.href === path,
  );
  if (navItem) {
    return navItem.label;
  }
  const segment = path.split("/").filter(Boolean).at(-1) ?? "";
  return segment
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function AppBreadcrumb({ pathname, role }: { pathname: string; role: Role }) {
  if (pathname === "/settings") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    return { href, label: getBreadcrumbLabel(href, role) };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const current = index === crumbs.length - 1;
          return (
            <Fragment key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {current ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function AppNavigation({ role }: { role: Role }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const items = [...navByRole[role], settingsNavItem];

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-border border-r bg-white"
    >
      <SidebarHeader className="border-border min-h-16 justify-center border-b px-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="pt-3">
        <SidebarGroup>
          <SidebarGroupLabel>{role} workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item: NavItem) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== roleHome[role] &&
                    pathname.startsWith(`${item.href}/`));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="text-forest-800 data-[active=true]:bg-forest-100 data-[active=true]:text-forest-800 h-10 data-[active=true]:relative data-[active=true]:before:absolute data-[active=true]:before:inset-y-1 data-[active=true]:before:left-0 data-[active=true]:before:w-0.5 data-[active=true]:before:bg-purple-500"
                    >
                      <Link href={item.href}>
                        <Icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-border border-t p-4">
        <RoleBadge role={role} />
      </SidebarFooter>
    </Sidebar>
  );
}

function AppUserMenu() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open user menu"
          className="gap-2"
          size="sm"
          variant="ghost"
        >
          <span className="bg-forest-100 text-forest-800 grid size-7 place-items-center rounded-full text-xs font-semibold">
            KS
          </span>
          <span className="hidden sm:inline">My account</span>
          <ChevronDown aria-hidden="true" className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Kisan Shiksha Setu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push("/settings")}>
          <Settings2 aria-hidden="true" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push("/")}>
          <LogOut aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DevelopmentRoleMenu({ role }: { role: Role }) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <DevelopmentRoleSwitcher role={role} />;
}

function DevelopmentRoleSwitcher({ role }: { role: Role }) {
  const router = useRouter();
  const setDevRole = useDevSessionStore((state) => state.setRole);

  return (
    <Select
      value={role}
      onValueChange={(value) => {
        const nextRole = getRole(value);
        if (nextRole) {
          setDevRole(nextRole);
          router.push(roleHome[nextRole]);
        }
      }}
    >
      <SelectTrigger
        aria-label="Switch development role"
        className="h-8 w-auto min-w-32"
        size="sm"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {(["mentor", "school", "admin"] as const).map((nextRole) => (
          <SelectItem key={nextRole} value={nextRole}>
            {nextRole[0]?.toUpperCase()}
            {nextRole.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const selectedRole = useRoleStore((state) => state.selectedRole);
  const setSelectedRole = useRoleStore((state) => state.setSelectedRole);
  const pathRole = getPathRole(pathname);
  const role = pathRole ?? selectedRole;

  useEffect(() => {
    if (pathRole) {
      setSelectedRole(pathRole);
    }
  }, [pathRole, setSelectedRole]);

  return (
    <SidebarProvider className="min-h-screen items-stretch">
      <AppNavigation role={role} />
      <SidebarInset className="min-h-screen min-w-0">
        <header className="border-border bg-background/95 sticky top-0 z-10 flex h-16 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
          <SidebarTrigger aria-label="Toggle navigation" />
          <div className="min-w-0 flex-1">
            <AppBreadcrumb pathname={pathname} role={role} />
          </div>
          <DevelopmentRoleMenu role={role} />
          <AppUserMenu />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
