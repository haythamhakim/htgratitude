import { useState } from "react";

export default function PinEntry({ onVerify }: { onVerify: () => void }) {
  const [pin, setPin] = useState("");
  const [wrongPin, setWrongPin] = useState(false);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
      if (value.length === 4) {
        fetch("/api/pin", {
          method: "POST",
          body: JSON.stringify({ pin: value }),
        }).then((res) => {
          if (res.ok) {
            setWrongPin(false);
            onVerify();
          } else {
            setWrongPin(true);
          }
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          Enter PIN
        </h2>
        <input
          type="text"
          value={pin}
          onChange={handlePinChange}
          maxLength={4}
          className="w-full text-center text-2xl tracking-widest p-3 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-700 focus:border-blue-500 mb-4"
          inputMode="numeric"
          pattern="\d*"
          autoFocus
        />
        {pin.length === 4 && wrongPin && (
          <p className="text-red-500 text-sm text-center">Incorrect PIN</p>
        )}
      </div>
    </div>
  );
}
