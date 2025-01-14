"use client";

import GratitudeInput from "@/components/gratitudeInput";
import PinEntry from "@/components/pinVerification";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ID, Query } from "appwrite";
import { useEffect, useRef, useState } from "react";
import ReactConfetti from "react-confetti";
import { Toaster, toast } from "react-hot-toast";
import { databases } from "./appwrite/config";

export default function Home() {
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [haythamStreak, setHaythamStreak] = useState(0);
  const [tasneemStreak, setTasneemStreak] = useState(0);
  const [editingHaytham, setEditingHaytham] = useState<number | null>(null);
  const [editingTasneem, setEditingTasneem] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = selectedDate;
  const [haythamTodayGratitude, setHaythamTodayGratitude] = useState<any[]>([]);
  const [tasneemTodayGratitude, setTasneemTodayGratitude] = useState<any[]>([]);
  const haythamGratitude = useRef<any[]>([]);
  const tasneemGratitude = useRef<any[]>([]);
  const entries = useRef<
    {
      date: string;
      haytham: string[];
      tasneem: string[];
    }[]
  >([]);
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isPinVerified) {
      const retrieveData = async () => {
        const gratitude = await databases.listDocuments(
          "677aa240003aea2c9bca",
          "677aa24a000d3fd012f6"
        );

        entries.current = gratitude.documents.reduce((acc: any[], doc: any) => {
          const existingEntry = acc.find((entry) => entry.date === doc.date);

          if (existingEntry) {
            // Update existing entry
            if (doc.user === "haytham") {
              existingEntry.haytham = doc.grateful;
            } else if (doc.user === "tasneem") {
              existingEntry.tasneem = doc.grateful;
            }
          } else {
            // Create new entry
            acc.push({
              date: doc.date,
              haytham: doc.user === "haytham" ? doc.grateful : [],
              tasneem: doc.user === "tasneem" ? doc.grateful : [],
            });
          }

          return acc;
        }, []);

        const gratitudeHToday = await databases.listDocuments(
          "677aa240003aea2c9bca",
          "677aa24a000d3fd012f6",
          [Query.equal("date", formattedDate), Query.equal("user", "haytham")]
        );

        const gratitudeTToday = await databases.listDocuments(
          "677aa240003aea2c9bca",
          "677aa24a000d3fd012f6",
          [Query.equal("date", formattedDate), Query.equal("user", "tasneem")]
        );

        setHaythamStreak(
          gratitude.documents.filter((doc: any) => doc.user === "haytham")
            .length
        );
        setTasneemStreak(
          gratitude.documents.filter((doc: any) => doc.user === "tasneem")
            .length
        );

        if (gratitudeHToday.documents.length > 0) {
          setHaythamTodayGratitude(gratitudeHToday.documents[0].grateful);
        }
        if (gratitudeTToday.documents.length > 0) {
          setTasneemTodayGratitude(gratitudeTToday.documents[0].grateful);
        }
      };
      retrieveData();
    }
  }, [
    isPinVerified,
    formattedDate,
    haythamTodayGratitude,
    tasneemTodayGratitude,
  ]);

  const handleSubmit = async (
    person: "haytham" | "tasneem",
    gratitude: any[]
  ) => {
    if (person === "haytham") {
      const id = ID.unique();
      const gratitudeId = id;
      const gratitudeHToday = await databases.listDocuments(
        "677aa240003aea2c9bca",
        "677aa24a000d3fd012f6",
        [Query.equal("date", formattedDate), Query.equal("user", "haytham")]
      );
      if (gratitudeHToday.documents.length > 0) {
        await databases.updateDocument(
          "677aa240003aea2c9bca",
          "677aa24a000d3fd012f6",
          gratitudeHToday.documents[0].id,
          { grateful: gratitude }
        );
      } else {
        await databases.createDocument(
          "677aa240003aea2c9bca",
          "677aa24a000d3fd012f6",
          gratitudeId,
          {
            user: "haytham",
            date: formattedDate,
            id: gratitudeId,
            grateful: gratitude,
          }
        );
      }
      setShowConfetti(true);
      toast.success("Haytham's gratitude journal entry recorded! 🦅", {
        duration: 3000,
      });
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      const id = ID.unique();
      const gratitudeId = id;
      const gratitudeTToday = await databases.listDocuments(
        "677aa240003aea2c9bca",
        "677aa24a000d3fd012f6",
        [Query.equal("date", formattedDate), Query.equal("user", "tasneem")]
      );
      if (gratitudeTToday.documents.length > 0) {
        await databases.updateDocument(
          "677aa240003aea2c9bca",
          "677aa24a000d3fd012f6",
          gratitudeTToday.documents[0].id,
          { grateful: gratitude }
        );
      } else {
        await databases.createDocument(
          "677aa240003aea2c9bca",
          "677aa24a000d3fd012f6",
          gratitudeId,
          {
            user: "tasneem",
            date: formattedDate,
            id: gratitudeId,
            grateful: gratitude,
          }
        );
      }
      setShowConfetti(true);
      toast.success("Tasneem's gratitude journal entry recorded! 🌸", {
        duration: 3000,
      });
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const onDaySelect = async (date: Date) => {
    setSelectedDate(date);
    const formattedSelectedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const gratitudeHSelected = await databases.listDocuments(
      "677aa240003aea2c9bca",
      "677aa24a000d3fd012f6",
      [
        Query.equal("date", formattedSelectedDate),
        Query.equal("user", "haytham"),
      ]
    );

    const gratitudeTSelected = await databases.listDocuments(
      "677aa240003aea2c9bca",
      "677aa24a000d3fd012f6",
      [
        Query.equal("date", formattedSelectedDate),
        Query.equal("user", "tasneem"),
      ]
    );

    setHaythamTodayGratitude(
      gratitudeHSelected.documents.length > 0
        ? gratitudeHSelected.documents[0].grateful
        : []
    );
    setTasneemTodayGratitude(
      gratitudeTSelected.documents.length > 0
        ? gratitudeTSelected.documents[0].grateful
        : []
    );
  };

  return (
    <>
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} />}
      <Toaster position="top-center" />
      {!isPinVerified && <PinEntry onVerify={() => setIsPinVerified(true)} />}
      {isPinVerified && (
        <main className="min-h-screen flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <div className="w-full bg-gray-50 p-4 text-center border-b">
                <h2 className="text-2xl font-semibold text-gray-700 cursor-pointer">
                  {formattedDate}
                </h2>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                entries={entries.current}
                onDayClick={(date) => {
                  onDaySelect(date);
                }}
              />
            </PopoverContent>
          </Popover>

          <div className="flex flex-1 flex-col lg:flex-row">
            {/* Haytham's Side */}
            <div className="flex-1 bg-blue-100 p-8">
              <div className="flex justify-center items-center gap-4 mb-8">
                <h1 className="text-4xl font-bold text-center text-gray-700">
                  Haytham 🦅
                </h1>
                <div className="bg-blue-200 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">
                    🔥 {haythamStreak} day streak
                  </span>
                </div>
              </div>
              {haythamTodayGratitude.length > 0 ? (
                <div className="space-y-4 max-w-md mx-auto">
                  <h3 className="text-center text-gray-700 font-medium">
                    Today&apos;s Gratitude (Click to Edit)
                  </h3>
                  {haythamTodayGratitude.map((item: string, index: number) => (
                    <div key={index}>
                      {editingHaytham === index ? (
                        <div className="space-y-2">
                          <GratitudeInput
                            id={`haytham-edit-${index}`}
                            placeholder={`Edit gratitude #${index + 1}`}
                            colorScheme="blue"
                            defaultValue={item}
                            onSubmit={(value) => {
                              const newGratitude = [...haythamTodayGratitude];
                              newGratitude[index] = value;
                              handleSubmit("haytham", newGratitude);
                              setEditingHaytham(null);
                              setHaythamTodayGratitude(newGratitude);
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => setEditingHaytham(index)}
                        >
                          <p className="text-gray-700">
                            #{index + 1}: {item}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-w-md mx-auto">
                  <label
                    htmlFor="haytham1"
                    className="block text-sm text-center font-medium text-gray-700"
                  >
                    Three things I&apos;m grateful for
                  </label>
                  <div className="space-y-2">
                    <label
                      htmlFor="haytham1"
                      className="block text-sm font-medium text-gray-700"
                    >
                      #1{" "}
                    </label>
                    <GratitudeInput
                      id="haytham1"
                      placeholder="Enter gratitude #1"
                      colorScheme="blue"
                      onSubmit={(value) => {
                        haythamGratitude.current[0] = value;
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="haytham"
                      className="block text-sm font-medium text-gray-700"
                    >
                      #2
                    </label>
                    <GratitudeInput
                      id="haytham"
                      placeholder="Enter gratitude #2"
                      colorScheme="blue"
                      onSubmit={(value) => {
                        haythamGratitude.current[1] = value;
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="haytham3"
                      className="block text-sm font-medium text-gray-700"
                    >
                      #3
                    </label>
                    <GratitudeInput
                      id="haytham3"
                      placeholder="Enter gratitude #3"
                      colorScheme="blue"
                      onSubmit={(value) => {
                        haythamGratitude.current[2] = value;
                      }}
                    />
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => {
                        handleSubmit("haytham", haythamGratitude.current);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors"
                    >
                      Submit Gratitude
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tasneem's Side */}
            <div className="flex-1 bg-pink-100 p-8">
              <div className="flex justify-center items-center gap-4 mb-8">
                <h1 className="text-4xl font-bold text-center text-gray-700">
                  Tasneem 🌸
                </h1>
                <div className="bg-pink-200 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">
                    🔥 {tasneemStreak} day streak
                  </span>
                </div>
              </div>
              {tasneemTodayGratitude.length > 0 ? (
                <div className="space-y-4 max-w-md mx-auto">
                  <h3 className="text-center text-gray-700 font-medium">
                    Today&apos;s Gratitude (Click to Edit)
                  </h3>
                  {tasneemTodayGratitude.map((item: string, index: number) => (
                    <div key={index}>
                      {editingTasneem === index ? (
                        <div className="space-y-2">
                          <GratitudeInput
                            id={`tasneem-edit-${index}`}
                            placeholder={`Edit gratitude #${index + 1}`}
                            colorScheme="pink"
                            defaultValue={item}
                            onSubmit={(value) => {
                              const newGratitude = [...tasneemTodayGratitude];
                              newGratitude[index] = value;
                              handleSubmit("tasneem", newGratitude);
                              setEditingTasneem(null);
                              setTasneemTodayGratitude(newGratitude);
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="p-4 bg-pink-50 rounded-lg cursor-pointer hover:bg-pink-100 transition-colors"
                          onClick={() => setEditingTasneem(index)}
                        >
                          <p className="text-gray-700">
                            #{index + 1}: {item}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-w-md mx-auto">
                  <label
                    htmlFor="tasneem1"
                    className="block text-sm text-center font-medium text-gray-700"
                  >
                    Three things I&apos;m grateful for
                  </label>
                  <div className="space-y-2">
                    <label
                      htmlFor="tasneem1"
                      className="block text-sm font-medium text-gray-700"
                    >
                      #1
                    </label>
                    <GratitudeInput
                      id="tasneem1"
                      placeholder="Enter gratitude #1"
                      colorScheme="pink"
                      onSubmit={(value) => {
                        tasneemGratitude.current[0] = value;
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="tasneem2"
                      className="block text-sm font-medium text-gray-700"
                    >
                      #2
                    </label>
                    <GratitudeInput
                      id="tasneem2"
                      placeholder="Enter gratitude #2"
                      colorScheme="pink"
                      onSubmit={(value) => {
                        tasneemGratitude.current[1] = value;
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="tasneem3"
                      className="block text-sm font-medium text-gray-700"
                    >
                      #3
                    </label>
                    <GratitudeInput
                      id="tasneem3"
                      placeholder="Enter gratitude #3"
                      colorScheme="pink"
                      onSubmit={(value) => {
                        tasneemGratitude.current[2] = value;
                      }}
                    />
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() =>
                        handleSubmit("tasneem", tasneemGratitude.current)
                      }
                      className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors"
                    >
                      Submit Gratitude
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
