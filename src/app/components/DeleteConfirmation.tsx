import React from "react";

interface I {
  deleteConfirmationRef: React.RefObject<HTMLDivElement>;
  confirmDeletion: (decision: string) => void;
  user: string;
}

function DeleteConfirmation({
  confirmDeletion,
  deleteConfirmationRef,
  user,
}: I) {
  return (
    <div
      className=" absolute right-0 sm:right-20 top-[14rem] sm:top-28 rounded-md p-6 bg-zinc-50 dark:bg-gray-800 flex flex-col  w-[13rem]
      sm:w-[20rem]"
      ref={deleteConfirmationRef}
    >
      <p className="text-xs sm:text-sm">
        Are you sure you want to delete your chat with {user}? This action is
        permanent and can not be reversed.
      </p>
      <div className="flex justify-between gap-2 mt-4 text-sm">
        <button
          className="cursor-pointer bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-800 text-zinc-50 rounded-md  py-2 px-4"
          onClick={() => confirmDeletion("cancel")}
        >
          Cancel
        </button>
        <button
          className="cursor-pointer bg-red-600 hover:bg-red-800 text-zinc-50 rounded-md  py-2 px-4"
          onClick={() => confirmDeletion("confirm")}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
