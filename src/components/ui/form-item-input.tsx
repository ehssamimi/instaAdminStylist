import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormItem, FormMessage, useFormField } from "@/components/ui/form";

type FormItemInputProps = React.ComponentProps<"input"> & {
  label: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Renders show/hide toggle on the right; input type is controlled internally. */
  passwordToggle?: boolean;
};

const FormItemInputFields = React.forwardRef<
  HTMLInputElement,
  FormItemInputProps
>(function FormItemInputFields(
  {
    label,
    hint,
    leftIcon,
    rightIcon,
    className,
    id: providedId,
    passwordToggle,
    type = "text",
    ...props
  },
  ref
) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType =
    passwordToggle === true ? (showPassword ? "text" : "password") : type;
  const hasRightAffix = Boolean(rightIcon) || passwordToggle === true;
  const canTogglePassword =
    passwordToggle === true &&
    props.value !== "" &&
    props.value !== undefined &&
    !props.disabled;

  return (
    <>
      <label
        htmlFor={formItemId}
        className="text-sm font-medium text-text-main"
      >
        {label}
      </label>
      <div className="relative">
        {leftIcon ? (
          <span
            className="pointer-events-none absolute left-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-gray-500 [&_svg]:size-5"
            aria-hidden
          >
            {leftIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          data-slot="form-control"
          id={formItemId}
          type={inputType}
          data-testid={providedId}
          aria-describedby={
            !error
              ? `${formDescriptionId}`
              : `${formDescriptionId} ${formMessageId}`
          }
          aria-invalid={!!error}
          className={cn(
            "hide-native-password-reveal w-full h-10 rounded-lg border border-gray-300 bg-surface px-3 text-sm text-gray-600 shadow-form-field outline-none transition-[color,box-shadow,border-color]",
            "placeholder:font-satoshi placeholder:text-base placeholder:font-normal placeholder:not-italic placeholder:leading-[130%] placeholder:text-gray-500 placeholder:opacity-100",
            "focus:border-brand focus:shadow-form-field focus:ring-2 focus:ring-brand/20",
            "aria-invalid:border-error-300 aria-invalid:shadow-form-field aria-invalid:ring-2 aria-invalid:ring-error-300/20",
            leftIcon ? "pl-10" : "",
            hasRightAffix ? "pr-10" : "",
            className
          )}
          {...props}
        />
        {passwordToggle ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 flex h-form-field w-10 shrink-0 items-center justify-center p-0 text-gray-500 hover:bg-transparent hover:text-gray-600 [&_svg]:size-5"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={!canTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword && canTogglePassword ? (
              <EyeIcon aria-hidden />
            ) : (
              <EyeOffIcon aria-hidden />
            )}
          </Button>
        ) : rightIcon ? (
          <span
            className="pointer-events-none absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-gray-500 [&_svg]:size-5"
            aria-hidden
          >
            {rightIcon}
          </span>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-text-muted">{hint}</p> : null}
      <FormMessage />
      {passwordToggle ? (
        <style>{`
            .hide-native-password-reveal::-ms-reveal,
            .hide-native-password-reveal::-ms-clear {
              display: none;
            }
          `}</style>
      ) : null}
    </>
  );
});

FormItemInputFields.displayName = "FormItemInputFields";

const FormItemInput = React.forwardRef<HTMLInputElement, FormItemInputProps>(
  function FormItemInput(props, ref) {
    return (
      <FormItem className="gap-1.5">
        <FormItemInputFields ref={ref} {...props} />
      </FormItem>
    );
  }
);

FormItemInput.displayName = "FormItemInput";

export { FormItemInput };
