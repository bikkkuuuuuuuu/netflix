import { useController } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { FileVideo, ImagePlus, Upload, X } from "lucide-react";

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
        className={`w-full min-h-[40px] mb-2 resize-none  rounded-xl pt-4 pl-6 pr-12     bg-[#121316] border border-white/[0.07]
                text-white placeholder:text-white/25 outline-none
                transition-all duration-200 hover:border-white/[0.11] focus:border-white/[0.18] focus:bg-[#141518  ${className} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
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

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  control: any;
  name: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  defaultValue?: string;
  errMsg?: string;
  className?: string;
}

export const SelectField = ({
  control,
  name,
  options,
  placeholder,
  defaultValue = "",
  errMsg = "",
  className = "",
}: SelectFieldProps) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
  });

  return (
    <div className="w-full">
      <div className="relative">
        <select
          {...field}
          value={field.value ?? ""}
          className={`h-12 w-full appearance-none rounded-xl border border-white/[0.07]
            bg-[#151619] px-4 pr-10 text-sm text-white outline-none
            transition-all duration-200 hover:border-white/[0.12]
            focus:border-white/[0.18] focus:bg-[#17181c]
            ${!field.value ? "text-neutral-600" : ""}
            ${className}`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[#151619] text-white"
            >
              {option.label}
            </option>
          ))}
        </select>

        <svg
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {errMsg && <p className="mt-1.5 text-xs text-red-400">{errMsg}</p>}
    </div>
  );
};

interface ImageUploaderProps {
  id?: string;
  control: any;
  name: string;
  label: string;
  description?: string;
  setError: Function;
  aspect?: "banner" | "logo";
  errMsg?: string;
}

export const ImageUploader = ({
  id,
  control,
  name,
  label,
  description,
  setError,
  aspect = "banner",
  errMsg = "",
}: ImageUploaderProps) => {
  const { field } = useController({
    control,
    name,
  });

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = (file?: File) => {
    if (!file) return;

    let extension = file.name.split(".").pop()?.toLowerCase();

    let allowed = import.meta.env.VITE_APP_ALLOWED_IMAGES_EXT.split(",");
    if (!extension || !allowed.includes(extension)) {
      setError(name, {
        type: "manual",
        message: "Use JPG, PNG or WebP.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(name, {
        type: "manual",
        message: "Maximum file size is 5 MB.",
      });
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return url;
    });

    field.onChange(file);
  };

  const clear = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    field.onChange(null);
  };

  const isBanner = aspect === "banner";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-md ml-2 font-medium text-neutral-200">{label}</p>

          {description && (
            <p className="mt-0.5 text-[13px] text-neutral-600">{description}</p>
          )}
        </div>
      </div>

      <label
        className={`group relative block cursor-pointer overflow-hidden rounded-2xl
          border border-dashed border-white/[0.08] bg-[#151619]
          transition-all duration-200 hover:border-white/[0.16]
          ${isBanner ? "aspect-[16/6]" : "aspect-[3/4.4] max-w-[180px]"}`}
      >
        {preview ? (
          <>
            <img src={preview} alt="" className="h-full w-full object-cover" />

            <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100" />

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                clear();
              }}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center
                rounded-lg border border-white/10 bg-black/60 text-white
                opacity-0 backdrop-blur-sm transition-opacity
                group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-5 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
              {isBanner ? (
                <ImagePlus className="h-5 w-5 text-neutral-500" />
              ) : (
                <Upload className="h-5 w-5 text-neutral-500" />
              )}
            </div>

            <p className="text-xs font-medium text-neutral-300">
              Upload {label.toLowerCase()}
            </p>

            <p className="mt-1 text-[12px] font-normal text-neutral-600">
              JPG, PNG or WebP · 5 MB max
            </p>
          </div>
        )}

        <input
          type="file"
          id={id || "image"}
          accept="image/jpeg,image/png,image/webp"
          className="hidden "
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </label>

      {errMsg && <p className="mt-1.5 text-xs text-red-400">{errMsg}</p>}
    </div>
  );
};

interface MovieUploaderProps {
  id?: string;
  control: any;
  name: string;
  setError: Function;
  errMsg?: string;
  maxSizeGB?: number;
}

export const MovieUploader = ({
  id = "movie-source",
  control,
  name,
  setError,
  errMsg = "",
  maxSizeGB = 20,
}: MovieUploaderProps) => {
  const { field } = useController({
    control,
    name,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(
    field.value instanceof File ? field.value : null,
  );

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 ** 3) {
      return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
    }

    return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["mp4", "mkv"];

    if (!extension || !allowedExtensions.includes(extension)) {
      setError(name, {
        type: "manual",
        message: "Unsupported format. Choose an MP4 or MKV video.",
      });
      return;
    }

    if (file.size > maxSizeGB * 1024 ** 3) {
      setError(name, {
        type: "manual",
        message: `Maximum file size is ${maxSizeGB} GB.`,
      });
      return;
    }

    setSelectedFile(file);
    field.onChange(file);
  };

  const clear = () => {
    setSelectedFile(null);
    field.onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        className="group cursor-pointer rounded-3xl border border-dashed border-white/[0.08]
          bg-[#0f1012] p-8 text-center transition-all hover:border-white/[0.16]"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-white/[0.04]">
          <Upload className="h-5 w-5 text-neutral-500 transition-colors group-hover:text-neutral-300" />
        </div>

        <h3 className="text-sm font-medium text-neutral-200">
          {selectedFile ? "Source video selected" : "Select source video"}
        </h3>

        <p className="mx-auto mt-1 max-w-sm text-sm leading-5 text-neutral-600">
          MP4 or MKV. The original file will be retained while transcoding
          creates the streaming versions.
        </p>

        <div className="mt-5 flex justify-center">
          <span className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-sm text-neutral-400">
            Browse files
          </span>
        </div>

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept=".mp4,.mkv,video/mp4,video/x-matroska"
          className="hidden"
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>

      {selectedFile && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0f1012] p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
              <FileVideo className="h-5 w-5 text-neutral-400" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-neutral-200">
                {selectedFile.name}
              </p>
              <p className="mt-1 text-xs text-neutral-600">
                {formatSize(selectedFile.size)} · Source video
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Remove source video"
            onClick={(event) => {
              event.stopPropagation();
              clear();
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
              border border-white/10 bg-white/[0.03] text-neutral-500
              transition hover:bg-white/[0.08] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {errMsg && <p className="mt-1.5 text-xs text-red-400">{errMsg}</p>}
    </div>
  );
};
