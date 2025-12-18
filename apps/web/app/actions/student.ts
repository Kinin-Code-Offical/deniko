"use server";

import { auth } from "@/auth";
import { internalApiFetch } from "@/lib/internal-api";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import logger from "@/lib/logger";
import { uploadFile } from "@/lib/storage";

import { createStudentSchema, updateStudentSchema } from "@/lib/schemas/student";

export async function createStudent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "unauthorized" };

  const rawData = {
    name: formData.get("name") as string,
    surname: formData.get("surname") as string,
    studentNo: (formData.get("studentNo") as string) || undefined,
    grade: (formData.get("grade") as string) || undefined,
    tempPhone: (formData.get("tempPhone") as string) || undefined,
    tempEmail: (formData.get("tempEmail") as string) || undefined,
    classroomIds: formData.getAll("classroomIds") as string[],
  };

  const validatedFields = createStudentSchema.safeParse(rawData);
  if (!validatedFields.success) return { success: false, error: "invalid_fields" };

  let avatarUrl: string | undefined;
  const file = formData.get("avatar") as File | null;
  const selectedAvatar = formData.get("selectedAvatar") as string | null;

  if (file && file.size > 0) {
    try {
      avatarUrl = await uploadFile(file, "avatars");
    } catch (_error) {
      return { success: false, error: "failed_to_upload_avatar" };
    }
  } else if (selectedAvatar) {
    avatarUrl = selectedAvatar;
  }

  try {
    const res = await internalApiFetch("/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
      },
      body: JSON.stringify({ ...validatedFields.data, avatarUrl }),
    });

    if (!res.ok) {
      const error = await res.json() as { error: string };
      return { success: false, error: error.error || "unknown_error" };
    }

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error) {
    logger.error({ error }, "Failed to create student");
    return { success: false, error: "unknown_error" };
  }
}

export async function claimStudentProfile(token: string, preferences: Record<string, unknown>) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "unauthorized" };

  try {
    const res = await internalApiFetch("/student/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
      },
      body: JSON.stringify({ token, preferences }),
    });

    if (!res.ok) {
      const error = await res.json() as { error: string };
      return { success: false, error: error.error || "unknown_error" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    logger.error({ error }, "Failed to claim student profile");
    return { success: false, error: "unknown_error" };
  }
}

export async function getInviteDetails(token: string) {
  try {
    const res = await internalApiFetch(`/student/invite/${token}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (_error) {
    return null;
  }
}

export async function getStudentProfileByToken(token: string) {
  try {
    const res = await internalApiFetch(`/student/token/${token}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (_error) {
    return null;
  }
}

export async function updateStudent(data: z.infer<typeof updateStudentSchema> & { avatar?: File | null, selectedAvatar?: string | null }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "unauthorized" };

  let avatarUrl: string | undefined;
  if (data.avatar && data.avatar.size > 0) {
    try {
      avatarUrl = await uploadFile(data.avatar, "avatars");
    } catch (_error) {
      return { success: false, error: "failed_to_upload_avatar" };
    }
  } else if (data.selectedAvatar) {
    avatarUrl = data.selectedAvatar;
  }

  try {
    const res = await internalApiFetch(`/student/${data.studentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
      },
      body: JSON.stringify({ ...data, avatarUrl }),
    });

    if (!res.ok) {
      const error = await res.json() as { error: string };
      return { success: false, error: error.error || "unknown_error" };
    }

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (_error) {
    return { success: false, error: "unknown_error" };
  }
}

export async function unlinkStudent(studentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "unauthorized" };

  try {
    const res = await internalApiFetch(`/student/${studentId}/unlink`, {
      method: "POST",
      headers: { "x-user-id": session.user.id },
    });

    if (!res.ok) return { success: false, error: "unknown_error" };

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (_error) {
    return { success: false, error: "unknown_error" };
  }
}

export async function deleteStudent(studentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "unauthorized" };

  try {
    const res = await internalApiFetch(`/student/${studentId}`, {
      method: "DELETE",
      headers: { "x-user-id": session.user.id },
    });

    if (!res.ok) return { success: false, error: "unknown_error" };

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (_error) {
    return { success: false, error: "unknown_error" };
  }
}

export async function deleteShadowStudent(studentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "unauthorized" };

  try {
    const res = await internalApiFetch(`/student/${studentId}/shadow`, {
      method: "DELETE",
      headers: { "x-user-id": session.user.id },
    });

    if (!res.ok) return { success: false, error: "unknown_error" };

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (_error) {
    return { success: false, error: "unknown_error" };
  }
}

export async function regenerateInviteToken(studentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "unauthorized" };

  try {
    const res = await internalApiFetch(`/student/${studentId}/invite/regenerate`, {
      method: "POST",
      headers: { "x-user-id": session.user.id },
    });

    if (!res.ok) return { success: false, error: "unknown_error" };

    const data = await res.json();
    revalidatePath("/dashboard/students");
    return { success: true, inviteToken: data.inviteToken };
  } catch (_error) {
    return { success: false, error: "unknown_error" };
  }
}

export async function toggleInviteLink(studentId: string, enable: boolean) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "unauthorized" };

  try {
    const res = await internalApiFetch(`/student/${studentId}/invite/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
      },
      body: JSON.stringify({ enable }),
    });

    if (!res.ok) return { success: false, error: "unknown_error" };

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (_error) {
    return { success: false, error: "unknown_error" };
  }
}

export async function updateStudentRelation(studentId: string, data: { customName?: string; privateNotes?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "unauthorized" };

  try {
    const res = await internalApiFetch(`/student/${studentId}/relation`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) return { success: false, error: "unknown_error" };

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (_error) {
    return { success: false, error: "unknown_error" };
  }
}

export async function updateStudentSettings(studentId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "unauthorized" };

  // Extract data from formData
  const data: Record<string, FormDataEntryValue> = {};
  formData.forEach((value, key) => {
    if (key !== 'avatar') data[key] = value;
  });

  let avatarUrl: string | undefined;
  const file = formData.get("avatar") as File | null;
  if (file && file.size > 0) {
    try {
      avatarUrl = await uploadFile(file, "avatars");
    } catch (_error) {
      return { success: false, error: "failed_to_upload_avatar" };
    }
  }

  try {
    const res = await internalApiFetch(`/student/${studentId}/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
      },
      body: JSON.stringify({ ...data, avatarUrl }),
    });

    if (!res.ok) return { success: false, error: "unknown_error" };

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (_error) {
    return { success: false, error: "unknown_error" };
  }
}
