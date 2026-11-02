"use client";

import { useState } from "react";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
  action: (formData: FormData) => Promise<void>;
};

export default function DeleteProductButton({
  productId,
  productName,
  action,
}: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Are you sure you want to delete "${productName}"? This action cannot be undone.`
        );

        if (!confirmed) {
          event.preventDefault();
          return;
        }

        setIsDeleting(true);
      }}
    >
      <input type="hidden" name="productId" value={productId} />

      <button
        type="submit"
        disabled={isDeleting}
        className="font-semibold text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </form>
  );
}