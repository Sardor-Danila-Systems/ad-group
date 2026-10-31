"use client";

import { startTransition, type FormEvent } from "react";

/**
 * Submit handler for admin forms. Passing a server action to <form action> makes React 19 clear every
 * field once the action finishes, so a validation error would wipe what the admin typed. Submitting
 * through onSubmit keeps the fields as they are; on success the action redirects or the page refreshes.
 */
export function keepFormSubmit(action: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
    startTransition(() => action(fd));
  };
}
