import { useEffect, useRef, type ReactNode } from "react";
import { usePreferences } from "../i18n";
import { Icon } from "./Icon";

export function MediaDialog({
  title,
  children,
  onClose,
  onPrevious,
  onNext,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  const { t } = usePreferences();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => {
      dialog.current?.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && onPrevious) {
        event.preventDefault();
        onPrevious();
      }
      if (event.key === "ArrowRight" && onNext) {
        event.preventDefault();
        onNext();
      }
    };
    const element = dialog.current;
    element?.addEventListener("keydown", key);
    return () => element?.removeEventListener("keydown", key);
  }, [onPrevious, onNext]);
  return (
    <dialog
      ref={dialog}
      className="media-dialog"
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-shell">
        <button
          className="dialog-close"
          onClick={onClose}
          aria-label={t.closeImage}
          autoFocus
        >
          <Icon name="close" />
        </button>
        {children}
        {(onPrevious || onNext) && (
          <div className="dialog-navigation">
            <button
              onClick={onPrevious}
              disabled={!onPrevious}
              aria-label={t.previousImage}
            >
              ← {t.previousImage}
            </button>
            <button
              onClick={onNext}
              disabled={!onNext}
              aria-label={t.nextImage}
            >
              {t.nextImage} →
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
