---
title: 'Dùng Web Bundles'
description: Cài một BMad web bundle dưới dạng Google Gemini Gem hoặc ChatGPT Custom GPT
---

Web bundles được cài từ **[bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/)**.

## Vì sao chỉ có một cửa vào

Trang web là đường dẫn cài đặt duy nhất được hỗ trợ cho bộ bundle. Nó giữ các bước luôn cập nhật khi Gemini và ChatGPT thay đổi, luôn trỏ tới bản phát hành được gắn tag mới nhất, và chỉ cần một lần đăng ký là bạn sẽ có tên trong danh sách nhận bundle mới khi chúng được phát hành.

## Bạn sẽ làm gì trên trang web

1. Chọn một bundle từ lưới thẻ.
2. Mở modal cài đặt. Chuyển giữa các tab **Gemini Gem** và **ChatGPT GPT** để xem các bước riêng cho từng nền tảng.
3. Tải bundle ZIP (một cú nhấp; đăng ký miễn phí một lần cho thành viên chỉ dùng email).
4. Làm theo các bước hiển thị trong modal: tạo Gem hoặc Custom GPT, tải lên các knowledge file, dán khối instructions, rồi lưu.

## Điều kiện cần

- **Với Gemini Gems**: gói Gemini Advanced.
- **Với ChatGPT Custom GPTs**: gói Plus, Pro, Business, hoặc Enterprise.
- Với các bundle dùng **Deep Research** (hiện tại là Market & Industry Research), hãy bật từ thanh prompt (Tools -> Deep Research). Deep Research có giới hạn riêng theo từng gói.

## Tùy chỉnh persona

Mỗi bundle có file `INSTRUCTIONS.md` (bên trong ZIP) chứa một **Persona Swap Example** phía trên ranh giới phần cần dán. Thay khối `[persona]` trong instructions đã cài bằng ví dụ hoán đổi đó để đổi giọng mà không đổi protocol. Bạn cũng có thể tự viết persona từ đầu; protocol vẫn giữ nguyên.

## Bạn nhận được gì

- Một Gem hoặc Custom GPT tái sử dụng được, tập trung vào một năng lực lập kế hoạch của BMad.
- Artifact chỉn chu (brief, PRD, báo cáo nghiên cứu, UX spec) sẵn sàng đưa vào IDE để triển khai.
- Cuộc hội thoại lập kế hoạch chạy trên gói web LLM hiện có của bạn thay vì dùng token IDE tính theo mức sử dụng.

:::caution[Persona drift]
Web LLM đôi khi làm rơi persona giữa các phiên dài. Nếu model bắt đầu nói lệch vai, hãy nhắc lại persona cho nó hoặc bắt đầu một phiên mới.
:::

## Tự xây bundle của bạn

Để biến một BMad skill hiện có thành web bundle, hãy dùng utility skill `bmad-os-skill-to-bundle` từ [bmad-utility-skills](https://github.com/bmad-code-org/bmad-utility-skills). Công cụ này tạo các file bundle với persona kế thừa từ agent sở hữu skill và một giọng tương phản làm ví dụ hoán đổi. Để gửi bundle của bạn lên bộ bundle, hãy mở PR trên [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) thêm thư mục bundle và một entry trong `web-bundles/bundles.json`.
