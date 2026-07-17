import pathlib

p = pathlib.Path('D:/玩具/Code/bread/components/AppShell.tsx')

lines = []

lines.append('"use client";')
lines.append('')
lines.append('import { useCallback, useEffect, useState } from "react";')
lines.append('import { AnimatePresence, motion } from "framer-motion";')
lines.append('import { Moon, Sun, Sparkles } from "lucide-react";')
lines.append('')
lines.append('import { useBread } from "@/context/BreadContext";')
lines.append('import { useToast } from "@/context/ToastContext";')
lines.append('')
lines.append('/* Navigation Tab Definitions */')
lines.append('')
lines.append('const PRIMARY_TABS = [')
lines.append('  { id: "assessment", label: "Assess", emoji: "\\u{1F4CB}", tour: "oven" },')
lines.append('  { id: "roadmap", label: "Kitchen", emoji: "\\u{1F35E}", tour: "bread" },')
lines.append('  { id: "premium", label: "Market", emoji: "\\u{1F48E}", tour: null },')
lines.append('  { id: "pantry", label: "Pantry", emoji: "\\u{1F9FA}", tour: null },')
lines.append('];')
lines.append('')

lines.append('import {')
lines.append('  injectDemoData,')
lines.append('  isDemoModeEnabled,')
lines.append('  setDemoModeFlag,')
lines.append('} from "@/lib/demo/injectDemoData";')
lines.append('import { GuidedTour, resetGuidedTour } from "@/components/GuidedTour";')
lines.append('')

p.write_text('\n'.join(lines), 'utf-8')
print("Part 1 done")
