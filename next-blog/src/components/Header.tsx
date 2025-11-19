"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [profileName, setProfileName] = useState("Alex 的博客");
  const [profileTagline, setProfileTagline] = useState("");
  const [avatarSrc, setAvatarSrc] = useState("/avatar-alex.png");

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("next-blog-profile");
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        name?: string;
        tagline?: string;
        avatarUrl?: string;
      };
      if (parsed.name) setProfileName(parsed.name);
      if (parsed.tagline) setProfileTagline(parsed.tagline);
      if (parsed.avatarUrl) setAvatarSrc(parsed.avatarUrl);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-zinc-200 shadow-sm dark:border-zinc-700">
            <Image
              src={avatarSrc}
              alt="博客头像"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col text-sm leading-tight">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{profileName}</span>
            {profileTagline && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{profileTagline}</span>
            )}
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex dark:text-zinc-300">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white">
            首页
          </Link>
          <Link href="#about" className="hover:text-zinc-900 dark:hover:text-white">
            关于
          </Link>
          <Link href="#archive" className="hover:text-zinc-900 dark:hover:text-white">
            归档
          </Link>
          <Link href="/tags" className="hover:text-zinc-900 dark:hover:text-white">
            标签
          </Link>
          <Link href="/archive" className="hover:text-zinc-900 dark:hover:text-white">
            归档视图
          </Link>
          <Link href="/write" className="hover:text-zinc-900 dark:hover:text-white">
            写文章
          </Link>
          <Link href="/admin" className="hover:text-zinc-900 dark:hover:text-white">
            后台
          </Link>
          <Link href="/profile" className="hover:text-zinc-900 dark:hover:text-white">
            我的主页
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="切换深浅色模式"
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-white shadow-sm transition hover:scale-105 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
          >
            <span
              className={`absolute inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs text-yellow-950 transition-transform duration-300 ${
                isDark ? "translate-y-6 scale-0 opacity-0" : "translate-y-0 scale-100 opacity-100"
              }`}
            >
              ☀
            </span>
            <span
              className={`absolute inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-700 text-xs text-zinc-50 transition-transform duration-300 ${
                isDark ? "translate-y-0 scale-100 opacity-100" : "-translate-y-6 scale-0 opacity-0"
              }`}
            >
              ☾
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:scale-105 hover:border-zinc-300 md:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500"
            aria-label="切换菜单"
          >
            <div className="space-y-0.5">
              <span className="block h-0.5 w-4 rounded-full bg-current"></span>
              <span className="block h-0.5 w-4 rounded-full bg-current"></span>
              <span className="block h-0.5 w-4 rounded-full bg-current"></span>
            </div>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-zinc-200 bg-white p-3 text-sm shadow-md md:hidden dark:border-zinc-800 dark:bg-zinc-900">
          <nav className="flex flex-col gap-2 text-zinc-600 dark:text-zinc-300">
            <Link href="/" className="rounded-lg px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              首页
            </Link>
            <Link href="#about" className="rounded-lg px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              关于
            </Link>
            <Link href="#archive" className="rounded-lg px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              归档
            </Link>
            <Link href="/tags" className="rounded-lg px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              标签
            </Link>
            <Link href="/archive" className="rounded-lg px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              归档视图
            </Link>
            <Link href="/write" className="rounded-lg px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              写文章
            </Link>
            <Link href="/admin" className="rounded-lg px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              后台
            </Link>
            <Link href="/profile" className="rounded-lg px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              我的主页
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
