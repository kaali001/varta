import { CheckCircle, XCircle } from "lucide-react";

interface PermissionStatusProps {
  isGranted: boolean;
  label: string;
  didUserInteracted: string | null;
}

export const PermissionStatus: React.FC<PermissionStatusProps> = ({
  isGranted,
  label,
  didUserInteracted,
}) => (
  <div
    className={`text-sm ${
      isGranted ? "text-green-500" : "text-red-500"
    } flex items-center justify-end`}
  >
    {isGranted ? (
      <>
        <CheckCircle className="w-4 h-4 mr-1" size={18} />
        {label} access granted
      </>
    ) : (
      <>
        <p className="grid grid-flow-col items-start gap-x-2">
          <XCircle className="w-4 h-4 mt-1" size={18} />
          {label} access denied.
          {didUserInteracted ? " Open browser settings and allow access" : null}
        </p>
      </>
    )}
  </div>
);
