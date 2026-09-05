export const ROLES = ["super_admin", "admin", "editor", "author"] as const;
export type Role = (typeof ROLES)[number];

export interface PermissionSet {
  /** "all" = can see/edit any user's content; "own" = only content they created. */
  contentScope: "all" | "own";
  canDeleteContent: boolean;
  canPublish: boolean;
  /** Upload + delete anyone's media. */
  canManageMedia: boolean;
  /** Upload media for use in their own content (implied by being able to edit content at all). */
  canUploadMedia: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canManageRoles: boolean;
  canViewActivityLogs: boolean;
}

export const PERMISSIONS: Record<Role, PermissionSet> = {
  super_admin: {
    contentScope: "all",
    canDeleteContent: true,
    canPublish: true,
    canManageMedia: true,
    canUploadMedia: true,
    canManageUsers: true,
    canManageSettings: true,
    canManageRoles: true,
    canViewActivityLogs: true,
  },
  admin: {
    contentScope: "all",
    canDeleteContent: true,
    canPublish: true,
    canManageMedia: true,
    canUploadMedia: true,
    canManageUsers: false,
    canManageSettings: false,
    canManageRoles: false,
    canViewActivityLogs: true,
  },
  editor: {
    contentScope: "all",
    canDeleteContent: false,
    canPublish: true,
    canManageMedia: false,
    canUploadMedia: true,
    canManageUsers: false,
    canManageSettings: false,
    canManageRoles: false,
    canViewActivityLogs: false,
  },
  author: {
    contentScope: "own",
    canDeleteContent: false,
    canPublish: true,
    canManageMedia: false,
    canUploadMedia: true,
    canManageUsers: false,
    canManageSettings: false,
    canManageRoles: false,
    canViewActivityLogs: false,
  },
};

export function permissionsFor(role: Role): PermissionSet {
  return PERMISSIONS[role];
}

/** Whether `profile` may modify a content row owned by `ownerId`. */
export function canAccessContent(
  permissions: PermissionSet,
  currentUserId: string,
  ownerId: string | null | undefined
): boolean {
  if (permissions.contentScope === "all") return true;
  return ownerId === currentUserId;
}

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  author: "Author",
};
