/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import type React from "react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";

import * as Yup from "yup";

export const taskSchema = Yup.object().shape({
  name: Yup.string().required("Task name is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed()
    .test("fileSize", "File too large", (value) => {
      if (!value) return true; // attachment is optional
      // @ts-expect-error size is not defined in type File
      return value.size <= 5000000; // 5MB limit
    })
    .test("fileFormat", "Unsupported format", (value) => {
      if (!value) return true;
      // @ts-expect-error size is not defined in type File
      return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
    }),
  completed: Yup.boolean(),
  gps_coordinates: Yup.string()
    .optional()
    .matches(
      /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/,
      "Must be valid GPS coordinates"
    ),
});

interface NewTaskModalProps {
  isOpen: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  error,
  onClose,
  onSubmit,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Formik
          initialValues={{
            name: "",
            description: "",
            image: null,
            completed: false,
            gps_coordinates: "",
            general: null,
          }}
          validationSchema={taskSchema}
          onSubmit={onSubmit}
        >
          {({ errors, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              {errors.general && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Task Name
                </label>
                <Field
                  name="name"
                  id="name"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <Field name="description" as={Textarea} />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageChange(event, setFieldValue)}
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500"
                />
                {previewUrl && (
                  <div className="mt-2">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={200}
                      height={200}
                      objectFit="contain"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Field
                  name="completed"
                  type="checkbox"
                  as={Checkbox}
                  id="completed"
                />
                <label
                  htmlFor="completed"
                  className="block text-sm font-medium text-gray-700"
                >
                  Completed
                </label>
              </div>
              <div>
                <label
                  htmlFor="gps_coordinates"
                  className="block text-sm font-medium text-gray-700"
                >
                  GPS Coordinates
                </label>
                <Field
                  name="gps_coordinates"
                  id="gps_coordinates"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <ErrorMessage
                  name="gps_coordinates"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <DialogFooter>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Add Task
                </button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
