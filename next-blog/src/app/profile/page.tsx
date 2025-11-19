"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STORAGE_KEY = "next-blog-profile";

type Profile = {
  name: string;
  tagline: string;
  avatarUrl: string;
  bio: string;
};

const defaultProfile: Profile = {
  name: "Alex 的博客",
  tagline: "",
  avatarUrl: "/avatar-alex.png",
  bio: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Profile>;
      setProfile({ ...defaultProfile, ...parsed });
    } catch {
      // ignore
    }
  }, []);

  function updateProfile(partial: Partial<Profile>) {
    const next = { ...profile, ...partial };
    setProfile(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  return (
    <div className="grid gap-6 rounded-3xl bg-white/80 p-6 text-sm shadow-sm ring-1 ring-zinc-100 backdrop-blur dark:bg-zinc-900/80 dark:ring-zinc-800 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <section className="flex flex-col items-center gap-4 border-b border-zinc-100 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6 dark:border-zinc-800">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-zinc-200 shadow-sm dark:border-zinc-700">
          <Image
            src={profile.avatarUrl || "/avatar-alex.png"}
            alt="头像预览"
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {profile.name}
          </h1>
          {profile.tagline && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{profile.tagline}</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">个人信息设置</h2>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500 dark:text-zinc-400">昵称</label>
          <input
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            placeholder="例如：Alex"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500 dark:text-zinc-400">个性签名（可选）</label>
          <input
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
            value={profile.tagline}
            onChange={(e) => updateProfile({ tagline: e.target.value })}
            placeholder="一句话介绍自己"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500 dark:text-zinc-400">头像图片地址</label>
          <input
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
            value={profile.avatarUrl}
            onChange={(e) => updateProfile({ avatarUrl: e.target.value })}
            placeholder="例如：https://.../avatar.png"
          />
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            可使用公网图片链接或 static /public 目录下的图片路径，如 /avatar-alex.png。
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500 dark:text-zinc-400">个人简介</label>
          <textarea
            className="min-h-[120px] rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
            value={profile.bio}
            onChange={(e) => updateProfile({ bio: e.target.value })}
            placeholder="简单介绍一下自己、技术方向或兴趣爱好..."
          />
        </div>
      </section>
    </div>
  );
}
