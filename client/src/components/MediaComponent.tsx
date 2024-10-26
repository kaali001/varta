interface MediaToggleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isPermissionGranted: boolean | null;
  onPermissionRequest: () => void;
}

export const MediaToggle: React.FC<MediaToggleProps> = ({
  icon,
  title,
  description,
  isPermissionGranted,
  onPermissionRequest,
}) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center">
      {icon}
      <div>
        <h4 className="text-lg font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <div className="flex items-center">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isPermissionGranted === true}
          onChange={onPermissionRequest}
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  </div>
);
