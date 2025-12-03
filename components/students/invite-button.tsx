'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import useCopyToClipboard from '@/lib/hooks/useCopyToClipboard';
import { toast } from 'sonner';

type InviteButtonProps = {
  token: string;
  lang: string;
  dictionary: any;
};

export function InviteButton({ token, lang, dictionary }: InviteButtonProps) {
  const [_, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    const inviteLink = `${window.location.origin}/${lang}/join/${token}`;
    copy(inviteLink)
      .then(() => {
        setIsCopied(true);
        toast.success(dictionary.teacher.invite_link_copied);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((error) => {
        toast.error(dictionary.teacher.invite_link_copy_failed);
        console.error('Failed to copy invite link: ', error);
      });
  };

  return (
    <Button onClick={onCopy} variant="outline" size="sm">
      {isCopied ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <Copy className="mr-2 h-4 w-4" />
      )}
      {dictionary.teacher.copy_invite_link}
    </Button>
  );
}