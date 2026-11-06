import React, { useState } from "react";
import {
  User,
  Lock,
  Play,
  Monitor,
  Bell,
  Languages,
  Shield,
  CreditCard,
  ChevronRight,
  Check,
  Moon,
  Volume2,
  Trash2,
  LogOut,
  Smartphone,
  Mail,
  Eye,
  Download,
  Sparkles,
} from "lucide-react";

type SettingsSection =
  | "account"
  | "playback"
  | "appearance"
  | "language"
  | "notifications"
  | "privacy"
  | "membership";

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
        enabled ? "bg-white" : "bg-white/10 border border-white/10"
      }`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all duration-300 ${
          enabled ? "left-[22px] bg-black" : "left-[3px] bg-neutral-500"
        }`}
      />
    </button>
  );
};

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  title,
  description,
  children,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between gap-5 px-5 py-5 transition-colors ${
        onClick ? "cursor-pointer hover:bg-white/[0.025]" : ""
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-10 w-10 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center text-neutral-300 shrink-0">
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">{title}</h3>

          {description && (
            <p className="text-sm text-neutral-500  leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};

const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
      <p className="text-lg text-neutral-500 mt-1">{description}</p>
    </div>
  );
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("account");

  const [autoplay, setAutoplay] = useState(true);
  const [previews, setPreviews] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);
  const [downloadWifiOnly, setDownloadWifiOnly] = useState(true);

  const sections = [
    {
      id: "account" as SettingsSection,
      label: "Account",
      icon: User,
    },
    {
      id: "playback" as SettingsSection,
      label: "Playback",
      icon: Play,
    },
    {
      id: "appearance" as SettingsSection,
      label: "Appearance",
      icon: Sparkles,
    },
    {
      id: "language" as SettingsSection,
      label: "Language & Subtitles",
      icon: Languages,
    },
    {
      id: "notifications" as SettingsSection,
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "privacy" as SettingsSection,
      label: "Privacy",
      icon: Shield,
    },
    {
      id: "membership" as SettingsSection,
      label: "Membership",
      icon: CreditCard,
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-full  text-white p-3 ">
      <div className="max-w-full mx-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h1 className="text-2xl md:text-5xl font-medium ">Settings</h1>
              <p className="text-lg text-neutral-500 mt-1">
                Manage your account and streaming preferences
              </p>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="rounded-[28px] bg-[#18191c] border border-white/[0.06] overflow-hidden">
              <div className="p-5 space-y-3">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const active = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-200 ${
                        active
                          ? "bg-white text-black shadow-lg"
                          : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />

                        <span className="text-lg font-semibold">
                          {section.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Account mini card */}
              <div className="border-t border-white/[0.06] p-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt="Profile"
                    className="h-10 w-10 rounded-xl object-cover"
                  />

                  <div className="min-w-0">
                    <p className="text-lg font-bold truncate">Bikash Pandey</p>

                    <p className="text-md text-neutral-500 truncate">
                      bikash@example.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Settings Content */}
          <main className="lg:col-span-9">
            <div className="rounded-[30px] bg-[#18191c] border border-white/[0.06] overflow-hidden">
              {/* ACCOUNT */}
              {activeSection === "account" && (
                <div>
                  <div className="p-6 md:p-7 border-b border-white/[0.06]">
                    <SectionHeader
                      title="Account"
                      description="Manage your profile and account security."
                    />

                    {/* Profile */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#121316] border border-white/[0.06] p-5">
                      <div className="absolute right-0 top-0 w-40 h-40 bg-white/[0.025] rounded-full blur-3xl" />

                      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                          <img
                            src="https://i.pravatar.cc/150?img=12"
                            alt="Profile"
                            className="h-16 w-16 rounded-2xl object-cover"
                          />

                          <div>
                            <h3 className="text-base font-bold">
                              Bikash Pandey
                            </h3>

                            <p className="text-sm text-neutral-500 mt-1">
                              Free account
                            </p>
                          </div>
                        </div>

                        <button className="px-4 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-colors">
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-white/[0.05]">
                    <SettingRow
                      icon={<Mail className="h-4 w-4" />}
                      title="Email address"
                      description="bikash@example.com"
                    >
                      <button className="text-sm font-semibold text-neutral-400 hover:text-white">
                        Change
                      </button>
                    </SettingRow>

                    <SettingRow
                      icon={<Lock className="h-4 w-4" />}
                      title="Password"
                      description="Last changed 3 months ago"
                    >
                      <button className="text-sm font-semibold text-neutral-400 hover:text-white">
                        Change
                      </button>
                    </SettingRow>

                    <SettingRow
                      icon={<Smartphone className="h-4 w-4" />}
                      title="Connected devices"
                      description="Manage devices currently signed in"
                    >
                      <ChevronRight className="h-4 w-4 text-neutral-500" />
                    </SettingRow>
                  </div>
                </div>
              )}

              {/* PLAYBACK */}
              {activeSection === "playback" && (
                <div>
                  <div className="p-6 md:p-7 border-b border-white/[0.06]">
                    <SectionHeader
                      title="Playback"
                      description="Control how movies and shows play on your devices."
                    />
                  </div>

                  <div className="divide-y divide-white/[0.05]">
                    <SettingRow
                      icon={<Play className="h-4 w-4" />}
                      title="Autoplay next episode"
                      description="Automatically play the next episode."
                    >
                      <Toggle
                        enabled={autoplay}
                        onChange={() => setAutoplay(!autoplay)}
                      />
                    </SettingRow>

                    <SettingRow
                      icon={<Eye className="h-4 w-4" />}
                      title="Autoplay previews"
                      description="Play previews while browsing."
                    >
                      <Toggle
                        enabled={previews}
                        onChange={() => setPreviews(!previews)}
                      />
                    </SettingRow>

                    <SettingRow
                      icon={<Monitor className="h-4 w-4" />}
                      title="High quality streaming"
                      description="Use higher quality when your connection allows it."
                    >
                      <Toggle
                        enabled={highQuality}
                        onChange={() => setHighQuality(!highQuality)}
                      />
                    </SettingRow>

                    <SettingRow
                      icon={<Download className="h-4 w-4" />}
                      title="Downloads over Wi-Fi only"
                      description="Prevent downloads from using mobile data."
                    >
                      <Toggle
                        enabled={downloadWifiOnly}
                        onChange={() => setDownloadWifiOnly(!downloadWifiOnly)}
                      />
                    </SettingRow>
                  </div>

                  {/* Quality */}
                  <div className="p-6 border-t border-white/[0.06]">
                    <h3 className="text-lg font-bold text-white mb-3">
                      Streaming Quality
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["Auto", "1080p", "720p", "480p"].map(
                        (quality, index) => (
                          <button
                            key={quality}
                            className={`rounded-xl border p-4 text-left transition-all ${
                              index === 0
                                ? "bg-white text-black border-white"
                                : "bg-[#121316] border-white/[0.06] text-neutral-400 hover:text-white hover:border-white/20"
                            }`}
                          >
                            <div className="text-sm font-bold">{quality}</div>

                            <div
                              className={`text-md mt-1 ${
                                index === 0
                                  ? "text-neutral-600"
                                  : "text-neutral-600"
                              }`}
                            >
                              {index === 0 ? "Recommended" : "Fixed quality"}
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* APPEARANCE */}
              {activeSection === "appearance" && (
                <div>
                  <div className="p-6 md:p-7 border-b border-white/[0.06]">
                    <SectionHeader
                      title="Appearance"
                      description="Customize the way your streaming experience looks."
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-3">Theme</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button className="rounded-2xl border-2 border-white bg-[#121316] p-3 text-left">
                        <div className="h-28 rounded-xl bg-[#0f1015] border border-white/10 p-3">
                          <div className="h-2 w-20 bg-white/20 rounded mb-2" />
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-14 bg-white/10 rounded-lg" />
                            <div className="h-14 bg-white/10 rounded-lg" />
                            <div className="h-14 bg-white/10 rounded-lg" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-bold">Dark</span>
                        </div>
                      </button>

                      <button className="rounded-2xl border border-white/[0.06] bg-[#121316] p-3 text-left hover:border-white/20 transition-colors">
                        <div className="h-28 rounded-xl bg-white p-3">
                          <div className="h-2 w-20 bg-black/10 rounded mb-2" />
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-14 bg-black/10 rounded-lg" />
                            <div className="h-14 bg-black/10 rounded-lg" />
                            <div className="h-14 bg-black/10 rounded-lg" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <Moon className="h-4 w-4 text-neutral-500" />
                          <span className="text-sm font-bold text-neutral-400">
                            Light
                          </span>
                        </div>
                      </button>

                      <button className="rounded-2xl border border-white/[0.06] bg-[#121316] p-3 text-left hover:border-white/20 transition-colors">
                        <div className="h-28 rounded-xl bg-gradient-to-br from-[#111] to-[#292929] p-3">
                          <div className="h-2 w-20 bg-white/20 rounded mb-2" />
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-14 bg-white/10 rounded-lg" />
                            <div className="h-14 bg-white/10 rounded-lg" />
                            <div className="h-14 bg-white/10 rounded-lg" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <Monitor className="h-4 w-4 text-neutral-500" />
                          <span className="text-sm font-bold text-neutral-400">
                            System
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-white/[0.05] border-t border-white/[0.06]">
                    <SettingRow
                      icon={<Sparkles className="h-4 w-4" />}
                      title="Reduce animations"
                      description="Use fewer animations throughout the application."
                    >
                      <Toggle
                        enabled={reduceMotion}
                        onChange={() => setReduceMotion(!reduceMotion)}
                      />
                    </SettingRow>
                  </div>
                </div>
              )}

              {/* LANGUAGE */}
              {activeSection === "language" && (
                <div>
                  <div className="p-6 md:p-7 border-b border-white/[0.06]">
                    <SectionHeader
                      title="Language & Subtitles"
                      description="Choose your preferred language and subtitle settings."
                    />
                  </div>

                  <div className="divide-y divide-white/[0.05]">
                    <SettingRow
                      icon={<Languages className="h-4 w-4" />}
                      title="Display language"
                      description="Language used throughout the application."
                    >
                      <select className="bg-[#121316] border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none">
                        <option>English</option>
                        <option>Nepali</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </SettingRow>

                    <SettingRow
                      icon={<Volume2 className="h-4 w-4" />}
                      title="Audio language"
                      description="Preferred audio language for movies."
                    >
                      <select className="bg-[#121316] border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none">
                        <option>English</option>
                        <option>Nepali</option>
                        <option>Spanish</option>
                      </select>
                    </SettingRow>

                    <SettingRow
                      icon={<Eye className="h-4 w-4" />}
                      title="Subtitle appearance"
                      description="Customize how subtitles appear during playback."
                    >
                      <ChevronRight className="h-4 w-4 text-neutral-500" />
                    </SettingRow>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeSection === "notifications" && (
                <div>
                  <div className="p-6 md:p-7 border-b border-white/[0.06]">
                    <SectionHeader
                      title="Notifications"
                      description="Choose when we should notify you."
                    />
                  </div>

                  <div className="divide-y divide-white/[0.05]">
                    <SettingRow
                      icon={<Mail className="h-4 w-4" />}
                      title="Email notifications"
                      description="New releases, recommendations and account updates."
                    >
                      <Toggle
                        enabled={emailNotifications}
                        onChange={() =>
                          setEmailNotifications(!emailNotifications)
                        }
                      />
                    </SettingRow>

                    <SettingRow
                      icon={<Bell className="h-4 w-4" />}
                      title="Push notifications"
                      description="Receive notifications on supported devices."
                    >
                      <Toggle
                        enabled={pushNotifications}
                        onChange={() =>
                          setPushNotifications(!pushNotifications)
                        }
                      />
                    </SettingRow>

                    <SettingRow
                      icon={<Sparkles className="h-4 w-4" />}
                      title="Personalized recommendations"
                      description="Get notified when something matches your taste."
                    >
                      <Toggle enabled onChange={() => {}} />
                    </SettingRow>
                  </div>
                </div>
              )}

              {/* PRIVACY */}
              {activeSection === "privacy" && (
                <div>
                  <div className="p-6 md:p-7 border-b border-white/[0.06]">
                    <SectionHeader
                      title="Privacy"
                      description="Control your data and privacy preferences."
                    />
                  </div>

                  <div className="divide-y divide-white/[0.05]">
                    <SettingRow
                      icon={<Eye className="h-4 w-4" />}
                      title="Viewing history"
                      description="Manage movies and shows you've watched."
                    >
                      <ChevronRight className="h-4 w-4 text-neutral-500" />
                    </SettingRow>

                    <SettingRow
                      icon={<Shield className="h-4 w-4" />}
                      title="Personalized data"
                      description="Allow us to use viewing activity to improve recommendations."
                    >
                      <Toggle
                        enabled={dataCollection}
                        onChange={() => setDataCollection(!dataCollection)}
                      />
                    </SettingRow>
                  </div>

                  <div className="p-6 border-t border-white/[0.06]">
                    <div className="rounded-2xl bg-red-500/[0.05] border border-red-500/10 p-5">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">
                            Delete account
                          </h3>

                          <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                            Permanently delete your account, profile, watch
                            history and preferences.
                          </p>

                          <button className="mt-4 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-colors">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MEMBERSHIP */}
              {activeSection === "membership" && (
                <div>
                  <div className="p-6 md:p-7 border-b border-white/[0.06]">
                    <SectionHeader
                      title="Membership"
                      description="Manage your streaming plan and billing."
                    />
                  </div>

                  <div className="p-6">
                    <div className="relative overflow-hidden rounded-3xl bg-white text-black p-6 md:p-7">
                      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-black/5" />
                      <div className="absolute -right-8 -bottom-24 h-56 w-56 rounded-full bg-black/5" />

                      <div className="relative">
                        <div className="flex items-center justify-between">
                          <span className="text-md font-black uppercase tracking-[0.2em]">
                            Current Plan
                          </span>

                          <span className="px-3 py-1 rounded-full bg-black text-white text-md font-bold">
                            FREE
                          </span>
                        </div>

                        <h2 className="text-3xl font-black mt-8 tracking-tight">
                          Free
                        </h2>

                        <p className="text-sm text-black/50 mt-1">
                          Enjoy your favorite movies and shows.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
                          {[
                            "HD Streaming",
                            "1 Device",
                            "Limited Downloads",
                            "Ad Supported",
                          ].map((feature) => (
                            <div
                              key={feature}
                              className="rounded-xl bg-black/[0.05] p-3"
                            >
                              <Check className="h-3.5 w-3.5 mb-2" />
                              <span className="text-md font-bold">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>

                        <button className="mt-6 px-5 py-3 rounded-xl bg-black text-white text-sm font-bold hover:bg-neutral-800 transition-colors">
                          Explore Plans
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-white/[0.05] border-t border-white/[0.06]">
                    <SettingRow
                      icon={<CreditCard className="h-4 w-4" />}
                      title="Payment methods"
                      description="Manage your saved payment methods."
                    >
                      <ChevronRight className="h-4 w-4 text-neutral-500" />
                    </SettingRow>

                    <SettingRow
                      icon={<CreditCard className="h-4 w-4" />}
                      title="Billing history"
                      description="View previous payments and invoices."
                    >
                      <ChevronRight className="h-4 w-4 text-neutral-500" />
                    </SettingRow>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 px-1">
              <button className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-white transition-colors">
                <LogOut className="h-4 w-4" />
                Sign out of all devices
              </button>

              <p className="text-md text-neutral-600">
                Changes are saved automatically
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
