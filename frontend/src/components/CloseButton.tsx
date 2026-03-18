import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CloseButtonProps {
  onClick?: () => void;
}

export function CloseButton({ onClick }: CloseButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate({ to: '/home' });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="fixed top-4 right-4 z-50 h-10 w-10 rounded-full"
      aria-label="Close"
    >
      <X className="h-5 w-5" />
    </Button>
  );
}
