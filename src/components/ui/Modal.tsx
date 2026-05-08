import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  className?: string;
};

export default function Modal({
  open,
  title,
  description,
  children,
  footer,
  onClose,
  className = "",
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-3xl border border-outline-variant bg-surface-container p-6 shadow-2xl ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {title ? (
              <h2 className="text-headline-sm font-semibold text-on-surface">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p className="mt-2 text-body-md text-on-surface-variant">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-6">{children}</div>

        {footer ? (
          <div className="mt-6 flex items-center justify-end gap-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
