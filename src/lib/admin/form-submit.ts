import { startTransition, type FormEvent } from "react";

/**
 * React 19 resets a `<form action={...}>` after every submission, including
 * ones that come back with validation errors - so editors lose everything
 * they typed. Dispatching the useActionState action from onSubmit (inside a
 * transition, so `pending` still works) submits the same FormData without
 * the automatic reset.
 */
export function submitWithoutReset(dispatch: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const formData = new FormData(event.currentTarget, submitter);
    startTransition(() => dispatch(formData));
  };
}
