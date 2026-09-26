import { useState } from 'react';
import { Button, type ButtonProps } from './button';
import { useToast } from './toast';

interface CopyButtonProps extends Omit<ButtonProps, 'children' | 'onClick'> {
  text: string;
  label: string;
  successLabel?: string;
}

/** Clipboard API with a textarea fallback: `navigator.clipboard` is undefined on
    http:// and in some older in-app webviews, which is exactly where this demo runs. */
export function CopyButton({ text, label, successLabel = 'คัดลอกแล้ว', ...rest }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.readOnly = true;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.append(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
      toast.show(successLabel, { tone: 'success' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.show('คัดลอกไม่สำเร็จ กรุณากดค้างเพื่อคัดลอก', { tone: 'error', assertive: true });
    }
  };

  return (
    <Button variant="ghost" leadingIcon={copied ? 'check' : 'content_copy'} onClick={copy} {...rest}>
      {copied ? successLabel : label}
    </Button>
  );
}
