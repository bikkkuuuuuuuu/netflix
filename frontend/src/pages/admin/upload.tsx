import { useState } from "react";
import {
  FileText,
  Video,
  Upload,
  Trash2,
  Layers,
  Plus,
  X,
  HardDrive,
  Image,
  LoaderCircle,
} from "lucide-react";

import {
  InputType,
  TextAreaField,
  TextInputField,
  SelectField,
  ImageUploader,
  MovieUploader,
} from "@/components/formFields";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import movieSvc from "@/services/movie.service";
import toast from "react-hot-toast";

interface DraftItem {
  id: string;
  title: string;
  type: "Movie" | "TV Show";
  size: string;
  progress: number;
  status: "Draft" | "Uploading" | "Ready";
}

const MovieDTO = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  releaseYear: Yup.string().required("Release year is required"),
  description: Yup.string().required("Description is required"),
  mediaType: Yup.string(),
  genre: Yup.string(),
  maturity: Yup.string(),
  imdbRating: Yup.string(),
  backdrop: Yup.mixed().nullable(),
  poster: Yup.mixed().nullable(),
  video: Yup.mixed<File>()
    .required("Source video is required")
    .test(
      "video-file",
      "Choose an MP4 or MKV video.",
      (value) => value instanceof File && /\.(mp4|mkv)$/i.test(value.name),
    ),
});

export default function AdminUpload() {
  const [activeTab, setActiveTab] = useState<"new" | "manage">("new");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [drafts, setDrafts] = useState<DraftItem[]>([
    {
      id: "d-1",
      title: "Dune: Part Two",
      type: "Movie",
      size: "14.2 GB",
      progress: 100,
      status: "Ready",
    },
    {
      id: "d-2",
      title: "Severance — Season 2",
      type: "TV Show",
      size: "3.8 GB",
      progress: 45,
      status: "Uploading",
    },
    {
      id: "d-3",
      title: "Cyberpunk: Edgerunners",
      type: "TV Show",
      size: "2.1 GB",
      progress: 0,
      status: "Draft",
    },
  ]);

  const [castInput, setCastInput] = useState("");

  const [castList, setCastList] = useState<string[]>([
    "Timothée Chalamet",
    "Zendaya",
  ]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(MovieDTO),
    defaultValues: {
      title: "",
      year: "",
      description: "",
      mediaType: "Movie",
      genre: "Sci-Fi",
      maturity: "PG-13",
      imdbRating: "",
      backdrop: null,
      poster: null,
      video: null,
    },
  });

  const showToast = (message: string) => {
    console.log(message);
  };

  const addCastMember = () => {
    const name = castInput.trim();

    if (!name || castList.includes(name)) {
      return;
    }

    setCastList((current) => [...current, name]);
    setCastInput("");
  };

  const removeCastMember = (name: string) => {
    setCastList((current) => current.filter((actor) => actor !== name));
  };

  const simulateUpload = () => {
    if (isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = window.setInterval(() => {
      setUploadProgress((current) => {
        if (current >= 100) {
          window.clearInterval(interval);
          setIsUploading(false);
          return 100;
        }

        return Math.min(current + 10, 100);
      });
    }, 350);
  };
  const submitForm = async (data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value),
        );
      }
    });
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const response = await movieSvc.create(formData, {
        onProgress: setUploadProgress,
      });
      console.log(response);
      setUploadProgress(100);
      if (response?.status === "MOVIE_CREATE_SUCCESS") {
        toast.success("Movie uploaded successfully");
      }
    } catch (exception) {
      console.log(exception);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto text-white no-scrollbar"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-4">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-3xl bg-[#121316] p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
                <Video className="h-4 w-4 text-neutral-300" />
              </div>

              <div>
                <h1 className="text-sm font-semibold tracking-tight text-white">
                  Upload Studio
                </h1>

                <p className="mt-0.5 text-sm text-neutral-500">
                  Add titles, artwork and source media to your catalog.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center rounded-xl bg-[#0f1012] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("new")}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                activeTab === "new"
                  ? "bg-white/[0.08] text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              New Upload
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("manage")}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                activeTab === "manage"
                  ? "bg-white/[0.08] text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Library
            </button>
          </div>
        </header>

        {/* Main */}
        {activeTab === "new" && (
          <form
            onSubmit={handleSubmit(submitForm)}
            className="grid grid-cols-1 gap-4 xl:grid-cols-12"
          >
            {/* LEFT */}
            <div className="space-y-4 xl:col-span-8">
              {/* Metadata */}
              <section className="rounded-3xl bg-[#121316] p-5">
                <div className="mb-5 flex items-center gap-3 border-b border-white/[0.06] pb-4">
                  <FileText className="h-4 w-4 text-neutral-400" />

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      General information
                    </h2>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                        Title
                      </label>

                      <TextInputField
                        type={InputType.TEXT}
                        name="title"
                        control={control}
                        placeholder="Dune: Part Two"
                        errMsg={errors.title?.message as string}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                        Format
                      </label>

                      <SelectField
                        name="mediaType"
                        control={control}
                        options={[
                          {
                            value: "Movie",
                            label: "Movie",
                          },
                          {
                            value: "TV Show",
                            label: "TV Show",
                          },
                          {
                            value: "Anime",
                            label: "Anime",
                          },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                        Genre
                      </label>

                      <SelectField
                        name="genre"
                        control={control}
                        options={[
                          {
                            value: "Sci-Fi",
                            label: "Sci-Fi",
                          },
                          {
                            value: "Action",
                            label: "Action",
                          },
                          {
                            value: "Drama",
                            label: "Drama",
                          },
                          {
                            value: "Thriller",
                            label: "Thriller",
                          },
                          {
                            value: "Comedy",
                            label: "Comedy",
                          },
                        ]}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                        Release year
                      </label>

                      <TextInputField
                        type={InputType.TEXT}
                        name="releaseYear"
                        control={control}
                        placeholder="2026"
                        errMsg={errors.releaseYear?.message as string}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                        IMDb
                      </label>

                      <TextInputField
                        type={InputType.TEXT}
                        name="imdbRating"
                        control={control}
                        placeholder="8.5"
                        errMsg=""
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                        Rating
                      </label>

                      <SelectField
                        name="maturity"
                        control={control}
                        options={[
                          {
                            value: "G",
                            label: "G",
                          },
                          {
                            value: "PG",
                            label: "PG",
                          },
                          {
                            value: "PG-13",
                            label: "PG-13",
                          },
                          {
                            value: "R",
                            label: "R",
                          },
                          {
                            value: "TV-MA",
                            label: "TV-MA",
                          },
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                      Synopsis
                    </label>

                    <TextAreaField
                      name="description"
                      control={control}
                      placeholder="Write a concise description of the title..."
                      rows={5}
                      errMsg={errors.description?.message as string}
                    />
                  </div>
                </div>
              </section>

              {/* Artwork */}
              <section className="rounded-3xl bg-[#121316] p-5">
                <div className="mb-5 flex items-center gap-3 border-b border-white/[0.06] pb-4">
                  <Image className="h-4 w-4 text-neutral-400" />

                  <div>
                    <h2 className="text-sm font-semibold text-white">Images</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_180px]">
                  <ImageUploader
                    control={control}
                    name="backdrop"
                    label="Banner"
                    // description="Wide artwork for hero sections and title pages."
                    setError={setError}
                    aspect="banner"
                    errMsg={errors.backdrop?.message as string}
                  />

                  <ImageUploader
                    control={control}
                    name="poster"
                    label="Logo"
                    // description="Transparent title logo."
                    setError={setError}
                    aspect="logo"
                    errMsg={errors.poster?.message as string}
                  />
                </div>
              </section>

              {/* Video */}

              {/* Video */}
              <section className="rounded-3xl bg-[#121316] p-5">
                <div className="mb-5 flex items-center gap-3 border-b border-white/[0.06] pb-4">
                  <HardDrive className="h-4 w-4 text-neutral-400" />

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Source media
                    </h2>

                    <p className="mt-0.5 text-sm text-neutral-600">
                      Upload the original source used for transcoding.
                    </p>
                  </div>
                </div>

                <MovieUploader
                  control={control}
                  name="video"
                  setError={setError}
                  errMsg={errors.video?.message as string}
                  maxSizeGB={20}
                />

                {/* {isUploading && (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs text-neutral-400">
        Uploading movie...
      </span>

      <span className="text-xs font-medium text-white tabular-nums">
        {uploadProgress}%
      </span>
    </div>

    <div
      className="h-1.5 overflow-hidden rounded-full bg-white/10"
      role="progressbar"
      aria-label="Movie upload progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={uploadProgress}
    >
      <div
        className="h-full rounded-full bg-red-500 transition-[width] duration-200"
        style={{ width: `${uploadProgress}%` }}
      />
    </div>
  </div>
)} */}
                {/* Upload progress */}
                {isUploading && (
                  <section className="rounded-2xl border border-white/[0.06] bg-[#121316] p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
                          <Upload className="h-4 w-4 text-neutral-300" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-white">
                            Uploading source media
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            Keep this page open while the upload is in progress.
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-medium tabular-nums text-white">
                        {uploadProgress}%
                      </span>
                    </div>

                    <div
                      className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
                      role="progressbar"
                      aria-label="Movie upload progress"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={uploadProgress}
                    >
                      <div
                        className="h-full rounded-full bg-red-500 transition-[width] duration-200 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-neutral-500">
                      <span>
                        {uploadProgress >= 100
                          ? "Upload sent"
                          : "Transferring file"}
                      </span>
                      <span>Please don't close this page</span>
                    </div>
                  </section>
                )}
              </section>

              {/* Cast */}
              <section className="rounded-3xl bg-[#121316] p-5">
                <div className="mb-5">
                  <h2 className="text-sm font-semibold text-white">Cast</h2>

                  <p className="mt-0.5 text-sm text-neutral-600">
                    Add the principal cast associated with this title.
                  </p>
                </div>

                <div className="flex gap-2">
                  <TextInputField
                    type={InputType.TEXT}
                    name="castInput"
                    control={control}
                    placeholder="Actor or creator name"
                    errMsg=""
                  />

                  <button
                    type="button"
                    onClick={addCastMember}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
                      border border-white/[0.07] bg-white/[0.04] text-neutral-300
                      transition hover:bg-white/[0.08] hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {castList.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {castList.map((actor) => (
                      <div
                        key={actor}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.06]
                          bg-[#0f1012] px-3 py-2 text-xs text-neutral-300"
                      >
                        <span>{actor}</span>

                        <button
                          type="button"
                          onClick={() => removeCastMember(actor)}
                          className="text-neutral-600 transition hover:text-neutral-300"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Actions */}
              <div className="flex items-center justify-between rounded-3xl bg-[#121316] p-4">
                <button
                  type="button"
                  onClick={() => showToast("Saved as draft")}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.03]
                    px-5 py-3 text-xs font-medium text-neutral-300 transition
                    hover:bg-white/[0.07] hover:text-white"
                >
                  Save draft
                </button>

                <button
                  disabled={isUploading}
                  type="submit"
                  className="rounded-xl bg-white px-6 py-3 text-xs font-semibold
                    text-black transition hover:bg-neutral-200 active:scale-[0.98]"
                >
                  {isUploading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    "Publish title"
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <aside className="space-y-4 xl:col-span-4">
              {/* Queue */}
              <section className="rounded-3xl bg-[#121316] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Layers className="h-4 w-4 text-neutral-400" />

                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        Upload queue
                      </h2>

                      <p className="mt-0.5 text-sm text-neutral-600">
                        Current uploads and saved drafts.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs tabular-nums text-neutral-600">
                    {drafts.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {drafts.map((item) => (
                    <div key={item.id} className="rounded-xl bg-[#0f1012] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-xs font-medium text-neutral-200">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-[12px] text-neutral-600">
                            {item.type} · {item.size}
                          </p>
                        </div>

                        <span className="shrink-0 text-[12px] text-neutral-600">
                          {item.progress}%
                        </span>
                      </div>

                      {item.progress > 0 && item.progress < 100 && (
                        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                          <div
                            className="h-full rounded-full bg-neutral-400"
                            style={{
                              width: `${item.progress}%`,
                            }}
                          />
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3">
                        <span className="text-[12px] text-neutral-600">
                          {item.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setDrafts((current) =>
                              current.filter((draft) => draft.id !== item.id),
                            );
                          }}
                          className="flex items-center gap-1.5 text-[12px] text-neutral-600 transition hover:text-neutral-300"
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Publishing ready titles")}
                  className="mt-4 w-full rounded-xl border border-white/[0.07]
                    bg-white/[0.03] py-3 text-xs font-medium text-neutral-300
                    transition hover:bg-white/[0.07] hover:text-white"
                >
                  Publish ready titles
                </button>
              </section>

              {/* Storage */}
              <section className="rounded-3xl bg-[#121316] p-6">
                <div className="flex items-center gap-3 ">
                  <HardDrive className="h-6 w-6 text-neutral-500" />

                  <div>
                    <h3 className="text-xs font-medium text-neutral-200">
                      Storage
                    </h3>

                    <p className="mt-0.5 text-[12px] text-neutral-600">
                      Source media and generated streams
                    </p>
                  </div>
                </div>

                <div className="mt-4 pb-4">
                  <div className="mb-2 flex items-center justify-between text-[12px]">
                    <span className="text-neutral-600">Used storage</span>

                    <span className="text-neutral-400">142 GB / 500 GB</span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-neutral-500"
                      style={{ width: "28.4%" }}
                    />
                  </div>
                </div>
              </section>
            </aside>
          </form>
        )}

        {activeTab === "manage" && (
          <section className="rounded-3xl bg-[#121316] p-8">
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <Layers className="mx-auto h-6 w-6 text-neutral-600" />

                <h2 className="mt-4 text-sm font-medium text-neutral-300">
                  Library management
                </h2>

                <p className="mt-1 text-xs text-neutral-600">
                  Your catalog management interface can live here.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
