import { useState } from "react";

interface GratitudeInputProps {
  id: string;
  placeholder: string;
  colorScheme: "blue" | "pink";
  onSubmit: (value: string) => void;
  defaultValue?: string;
}

export default function GratitudeInput({
  id,
  placeholder,
  colorScheme,
  onSubmit,
  defaultValue = "",
}: GratitudeInputProps) {
  const [isEditing, setIsEditing] = useState(true);
  const [value, setValue] = useState(defaultValue);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onSubmit(value);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSubmit(value);
  };

  if (!isEditing) {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className={`w-full p-2 border rounded-md shadow-sm cursor-pointer hover:bg-${colorScheme}-50 text-gray-700`}
      >
        {value || "Click to edit"}
      </div>
    );
  }

  return (
    <input
      type="text"
      id={id}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={`w-full p-2 border rounded-md shadow-sm focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500 text-gray-700`}
      placeholder={placeholder}
    />
  );
}
