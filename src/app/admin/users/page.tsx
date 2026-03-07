"use client";

import { useEffect, useState } from "react";
import { Shield, ShieldOff, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminUsers, verifyUser, suspendUser } from "@/lib/services/admin.service";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    getAdminUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const handleVerify = async (u: User) => {
    setBusy(u.id);
    await verifyUser(u.id);
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, isVerified: true } : x));
    setBusy(null);
    toast.success(`${u.name} verified.`);
  };

  const handleSuspend = async (u: User) => {
    setBusy(u.id);
    await suspendUser(u.id);
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, isSuspended: true } : x));
    setBusy(null);
    toast.success(`${u.name} suspended.`);
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground mt-1">Manage farmer and buyer accounts.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <CardTitle className="text-sm text-muted-foreground ml-auto">
              {filtered.length} user{filtered.length !== 1 ? "s" : ""}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 text-left">User</th>
                    <th className="px-3 py-3 text-left hidden sm:table-cell">Role</th>
                    <th className="px-3 py-3 text-left hidden md:table-cell">Location</th>
                    <th className="px-3 py-3 text-left">Status</th>
                    <th className="px-3 py-3 text-left hidden lg:table-cell">Joined</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((u) => {
                    const initials = u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.profilePhoto} alt={u.name} />
                              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 hidden sm:table-cell">
                          <Badge variant="outline" className="capitalize text-xs">{u.role}</Badge>
                        </td>
                        <td className="px-3 py-3 hidden md:table-cell text-muted-foreground">
                          {u.location.city}, {u.location.country}
                        </td>
                        <td className="px-3 py-3">
                          {u.isSuspended ? (
                            <Badge className="bg-red-100 text-red-700 border-0 text-xs">Suspended</Badge>
                          ) : u.isVerified ? (
                            <Badge className="bg-green-100 text-green-700 border-0 text-xs">Verified</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">Pending</Badge>
                          )}
                        </td>
                        <td className="px-3 py-3 hidden lg:table-cell text-muted-foreground">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-3 py-3">
                          {u.role !== "admin" && (
                            <div className="flex gap-1">
                              {!u.isVerified && !u.isSuspended && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs gap-1"
                                  disabled={busy === u.id}
                                  onClick={() => handleVerify(u)}
                                >
                                  <Shield className="h-3 w-3" />Verify
                                </Button>
                              )}
                              {!u.isSuspended && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
                                  disabled={busy === u.id}
                                  onClick={() => handleSuspend(u)}
                                >
                                  <ShieldOff className="h-3 w-3" />Suspend
                                </Button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
