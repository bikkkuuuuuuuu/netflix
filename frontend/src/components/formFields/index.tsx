import { useController } from "react-hook-form";
import { useState } from "react";

interface LabelProps {
  htmlFor: string;
  children: any;
}
export interface TextAreaFieldProps {
  name: string;
  control: any;
  defaultValue?: string;
  errMsg?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export const InputLabel = ({ htmlFor, children }: LabelProps) => {
  return (
    <>
      <label className="text-sm font-medium" htmlFor={htmlFor}>
        {children}
      </label>
    </>
  );
};
export enum InputType {
  TEXT = "text",
  EMAIL = "email",
  PASSWORD = "password",
  DATE = "date",
  URL = "url",
  TEL = "tel",
  FILE = "file",
  NUMBER = "number",
}

export interface TextInputFieldProps {
  control: any;
  name: string;
  errMsg: string;
  type?: InputType;
  placeholder?: string;
  className?: string;
}

export const TextInputField = ({
  control,
  errMsg,
  name,
  type = InputType.TEXT,
  placeholder,
  className = "",
}: TextInputFieldProps) => {
  const { field } = useController({
    control: control,
    name: name,
  });
  return (
    <>
      <input
        className={`w-full h-14 ${className}  rounded-xl pl-12 pr-4  focus:outline-none focus:ring-2 focus:ring-blue-500 
                bg-[#121316] border border-white/[0.07]
                text-white placeholder:text-white/25 outline-none
                transition-all duration-200 hover:border-white/[0.11] focus:border-white/[0.18] focus:bg-[#141518]`}
        placeholder={placeholder}
        type={type}
        {...field}
      />

      <span className="text-red-400">{errMsg}</span>
    </>
  );
};

export const TextAreaField = ({
  name,
  control,
  defaultValue = "",
  errMsg = "",
  className = "",
  placeholder,
  rows = 6,
}: TextAreaFieldProps) => {
  const { field } = useController({
    control: control,
    name: name,
    defaultValue: defaultValue,
  });
  return (
    <>
      <textarea
        placeholder={placeholder}
        {...field}
        rows={rows}
        className={`w-full min-h-[40px] mb-2 resize-none bg-gray-50 rounded-xl pt-4 pl-6 pr-12 border border-gray-200  ${className} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
      />
      <span className="text-red-500 text-sm">{errMsg}</span>
    </>
  );
};
export interface SingleImageUploaderProps {
  id?: string;
  errMsg?: string;
  control: any;
  name: string;
  setError: Function;
  className?: string;
  onImageChange?: (url: string) => void;
  isHidden?: boolean;
  inputRef?: any;
}

export const SingleImageUploader = ({
  name,
  control,
  setError,
  errMsg = "",
  className = "",
  isHidden = false,
  onImageChange,
  inputRef,
}: SingleImageUploaderProps) => {
  const { field } = useController({
    control: control,
    name: name,
  });

  const [thumb, setThumb] = useState<File | null>(null);

  return (
    <>
      <div className={`flex flex-row ${isHidden ? "hidden" : ""} `}>
        <div
          className=" w-2/3 flex flex-col relative cursor-pointer"
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          <input
            ref={inputRef}
            accept="image/*"
            className={`${className} absolute inset-0 w-full h-full opacity-0 cursor-pointer  `}
            id="image"
            type="file"
            onChange={(e: any) => {
              let image = e.target.files[0];
              console.log(image);
              let extension = image.name.split(".").pop(); //image.png => {"image","png"} =>'png'
              let allowed = import.meta.env.VITE_APP_ALLOWED_EXT.split(",");
              if (allowed.includes(extension.toLowerCase())) {
                if (image.size <= 3145728) {
                  setThumb(image);
                  field.onChange(image);
                  onImageChange?.(URL.createObjectURL(image));
                } else {
                  console.log("hey whats up");
                  setError(name, "File size is too large");
                  setThumb(null);
                }
              } else {
                setError(name, "Image format not supported");
                setThumb(null);
              }
            }}
          />
          <span className="text-red-500 text-sm">{errMsg}</span>
        </div>
        <div className="w-1/3 flex">
          <img
            src={
              thumb && typeof thumb === "object"
                ? URL.createObjectURL(thumb)
                : "https://placehold.co/400?text=Upload"
            }
            alt=""
          ></img>
        </div>
      </div>
    </>
  );
};
