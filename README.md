# PADIS 床邊評估

依 **SCCM PADIS 2018 指引**與 **2025 focused update** 製作的加護病房床邊評估工具，涵蓋疼痛、鎮靜、譫妄、早期活動、睡眠與焦慮，每床每班記錄。

線上版：https://yht5582-source.github.io/ICU-sedation/

> ⚠️ **僅供臨床評估輔助與教學，不取代臨床判斷。** 藥物選擇與劑量請依院內規範；CAM-ICU 注意力測試請使用院內核可的中文版本。

## 功能

| 模組 | 內容 |
|---|---|
| P 疼痛 | NRS（0–10）、CPOT（0–8，≥3 明顯疼痛）、BPS／BPS-NI（3–12，>5 明顯疼痛）；插管與否自動切換「呼吸器順從度」或「發聲」項目；有疼痛時提示止痛優先與多模式止痛 |
| S 鎮靜 | 設定 RASS 目標（淺鎮靜、清醒平靜、深鎮靜需填適應症）；三步驟 RASS 引導評估；判斷過深或過躁動並提示處置；依目前藥物提示 dexmedetomidine、propofol、benzodiazepine 的選擇 |
| D 譫妄 | CAM-ICU 四個特徵逐步流程（字母注意力測試自動計算錯誤數、特徵 3 依 RASS 自動判斷、特徵 4 問答）；或 ICDSC 8 項評分；陽性時提示處置 |
| M 早期活動 | 活動前安全評估、ICU Mobility Scale（0–10）今日等級與明日目標、PADIS 2025 加強版活動復健、停止條件 |
| Z 睡眠與焦慮 | 睡眠介入（含 melatonin）、焦慮評估與非藥物介入 |

其他功能：
- **床位與班別**：依目前時間自動選白班、小夜或大夜。
- **沿用上一班**：自動帶入插管狀態、鎮靜目標、使用中的藥物、評估工具與活動目標。
- **床號警示**：床號按鈕標示明顯疼痛、譫妄、RASS 未達標。
- **近 9 班趨勢表**：追蹤疼痛、RASS、譫妄、活動等級。
- **一鍵複製本班摘要**：可貼到護理紀錄。

## PADIS 2025 focused update 重點

| 主題 | 建議 | 確定性 |
|---|---|---|
| 焦慮 | benzodiazepine 治療焦慮：證據不足，無建議 | 不足 |
| 鎮靜 | 以淺鎮靜或降低譫妄為優先時，dexmedetomidine 優於 propofol（注意心搏過緩） | 中度 |
| 譫妄 | 抗精神病藥物治療譫妄：無法建議使用或不使用 | 低 |
| 活動 | 加強版活動復健優於一般照護 | 中度 |
| 睡眠 | 建議使用 melatonin | 低 |

## 使用方式

直接用瀏覽器開啟 `index.html` 即可，不需安裝或建置。

## 在地化設定

| 項目 | 位置 |
|---|---|
| 床號 | 網頁右側「床號設定」 |
| CPOT／BPS 項目文字 | `<script>` 內 `CPOT`、`BPS` |
| RASS 描述與目標範圍 | `RASS`、`TARGETS` |
| CAM-ICU 字母與問題 | `LET`（預設 SAVEAHAART）、`CAMQ` |
| ICDSC 項目 | `ICDSC` |
| 活動安全條件與 IMS | `MOB_SAFE`、`IMS` |
| 睡眠與焦慮介入 | `SLEEP`、`ANX` |
| 配色 | `<style>` 開頭 `:root` 的色彩變數 |

## 資料與隱私

- 所有資料只存在該瀏覽器的 `localStorage`，不會上傳；不同電腦、不同瀏覽器的資料各自獨立。
- 只記錄床號，請勿輸入姓名或病歷號。

## 依據

1. Devlin JW, Skrobik Y, Gélinas C, et al. Clinical practice guidelines for the prevention and management of pain, agitation/sedation, delirium, immobility, and sleep disruption in adult patients in the ICU. *Crit Care Med* 2018;46:e825–e873.
2. Lewis K, Balas MC, Stollings JL, et al. A focused update to the clinical practice guidelines for the prevention and management of pain, anxiety, agitation/sedation, delirium, immobility, and sleep disruption in adult patients in the ICU. *Crit Care Med* 2025;53:e711–e727. [doi:10.1097/CCM.0000000000006574](https://doi.org/10.1097/CCM.0000000000006574)
3. Gélinas C, et al. Validation of the Critical-Care Pain Observation Tool in adult patients. *Am J Crit Care* 2006;15:420–427.
4. Payen JF, et al. Assessing pain in critically ill sedated patients by using a behavioral pain scale. *Crit Care Med* 2001;29:2258–2263.
5. Sessler CN, et al. The Richmond Agitation-Sedation Scale. *Am J Respir Crit Care Med* 2002;166:1338–1344.
6. Ely EW, et al. Delirium in mechanically ventilated patients: validity and reliability of the CAM-ICU. *JAMA* 2001;286:2703–2710.
7. Bergeron N, et al. Intensive Care Delirium Screening Checklist. *Intensive Care Med* 2001;27:859–864.
8. Hodgson C, et al. Feasibility and inter-rater reliability of the ICU Mobility Scale. *Heart Lung* 2014;43:19–24；Hodgson CL, et al. Expert consensus and recommendations on safety criteria for active mobilization. *Crit Care* 2014;18:658.

## 授權

請依使用單位規定自行選擇授權方式（例如 MIT）。
