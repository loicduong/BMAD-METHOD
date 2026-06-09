---
title: 'Web Bundles'
description: BMad skills được đóng gói cho Google Gemini Gems và ChatGPT Custom GPTs
---

Chạy phần lập kế hoạch của BMad trên gói web LLM của bạn, rồi đưa artifact vào IDE.

## Web Bundle là gì?

Web bundle là một BMad skill được đóng gói lại để cài dưới dạng **Google Gemini Gem** hoặc **ChatGPT Custom GPT**. Mỗi bundle gồm một protocol `SKILL.md` mà bạn tải lên như knowledge file, một khối `INSTRUCTIONS.md` mà bạn dán vào instructions của Gem hoặc GPT, và mọi file dữ liệu skill cần dùng (CSV, template, checklist xác thực, cùng nội dung được progressive disclosure bổ sung). Persona nằm trong instructions được dán; protocol nằm trong knowledge file. Bạn có thể đổi persona mà không cần chạm vào protocol.

Việc thiết lập không phải một cú nhấp, nhưng các bước đều được hướng dẫn. **Cài từ [bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/)**. Trang web liệt kê mọi bundle trong một lưới thẻ, hiển thị trực tiếp các bước cài cho Gemini và ChatGPT, rồi cung cấp file ZIP để tải xuống. Đây là đường dẫn cài đặt được hỗ trợ; pattern giống nhau trên toàn bộ bộ bundle, nên sau khi cài một bundle, các bundle sau chỉ còn là thao tác lặp lại.

V4 của BMad từng phát hành web bundles. V6 đưa chúng trở lại, được viết lại cho các nền tảng Gem và Custom GPT hiện tại, có tính đến Canvas, Deep Research, và tạo ảnh.

## Vì sao nên dùng

Công việc lập kế hoạch và công việc triển khai cần các công cụ khác nhau. Web bundles giúp mỗi việc dùng đúng công cụ.

| Mối quan tâm | Web LLM (Gem hoặc GPT) | IDE (Claude Code, Cursor) |
| --- | --- | --- |
| Mô hình chi phí | Gói thuê bao cố định | Token tính theo mức sử dụng |
| Mạnh nhất ở | Hội thoại, Canvas, Deep Research, hình ảnh | File, terminal, context codebase |
| Phù hợp nhất cho | Brainstorming, brief, PRD, nghiên cứu | Triển khai, refactor, code review |

Chạy trọn một phiên PRD hoặc nghiên cứu thị trường trong IDE sẽ tiêu tốn token, trong khi Gem hoặc Custom GPT xử lý với chi phí của gói thuê bao hiện có. Artifact đã được trau chuốt sau đó được đưa vào repo, và Claude Code hoặc Cursor tiếp tục từ đó.

:::tip[Lập kế hoạch trên web, xây dựng trong IDE]
Khoản tiết kiệm chi phí sẽ cộng dồn trong các engagement dài hơn. Một lượt PRFAQ và ba vòng nghiên cứu trong Gem không phát sinh thêm chi phí biên; cùng lượng công việc đó trong IDE là chi phí thật.
:::

## Có gì trong bộ bundle

Bộ bundle hiện tại bao phủ các phase phân tích và lập kế hoạch:

| Bundle | Phase | Dòng persona |
| --- | --- | --- |
| Brainstorming Coach | Analysis | Osborn (mặc định), Minto (hoán đổi) |
| Product Brief Coach | Analysis | Mary (BMad analyst) |
| PRFAQ Coach | Analysis | Working Backwards (Bezos) |
| PRD Coach | Planning | Cagan |
| UX Coach | Planning | Norman |
| Market & Industry Research | Analysis | Porter và Christensen |

Mỗi bundle mang một persona mặc định kế thừa từ BMad agent sở hữu nó (nếu có) và một ví dụ hoán đổi tương phản để minh họa pattern đổi giọng.

## Một phiên hoạt động như thế nào

1. **Mở Gem hoặc Custom GPT.** Persona chào theo đúng vai và bắt đầu khám phá bằng hội thoại.
2. **Khám phá phạm vi.** Persona hỏi bạn đang muốn làm gì, bạn có gì trong tay, và có ràng buộc nào. Không phải điền form.
3. **Làm việc trong Canvas.** Protocol mở Canvas ngay đầu phiên và cập nhật liên tục. Sơ đồ Mermaid và bảng HTML đi kèm phần văn bản.
4. **Bàn giao.** Khi hoàn tất, bạn có một tài liệu Canvas có thể export, dán vào repo, hoặc đưa cho một BMad skill trong IDE để xử lý phase tiếp theo.

Với các bundle tích hợp Deep Research (hiện tại là Market & Industry Research), persona sẽ soạn một brief Deep Research ở giữa phiên để bạn dán vào chế độ Deep Research của Gemini hoặc ChatGPT, rồi tiếp nhận báo cáo được trả về.

## Khi nào nên dùng web bundle

- Bạn đang thực hiện phần suy nghĩ ban đầu cho một dự án và muốn một công cụ tập trung có persona, Canvas, và Deep Research.
- Bạn muốn giữ chi phí token IDE cho phần coding thật sự.
- Bạn đang chia sẻ artifact lập kế hoạch với cộng tác viên không có cùng setup IDE.

## Khi nào nên ở lại trong IDE

- Công việc cần đọc hoặc chỉnh sửa code trong repo.
- Bạn đang ở giữa quá trình triển khai và muốn giữ context.
- Bạn không có gói Gemini Advanced hoặc ChatGPT Plus.

## Cập nhật và tùy chỉnh

Bundles sẽ tiếp tục phát triển. Khi bạn lấy phiên bản bundle mới hơn, cập nhật thường nằm ở các knowledge file (`SKILL.md` protocol và template, CSV, hoặc checklist xác thực đính kèm). Hãy tải lại các file đó lên Gem hoặc Custom GPT để nhận cập nhật. Khối instructions thường không thay đổi.

Nếu muốn tùy chỉnh bundle cho đội ngũ hoặc giọng của bạn, hãy làm trong **khối instructions** đã dán vào Gem hoặc GPT, không làm trong knowledge file. Khối instructions là nơi đặt persona, preference, và mọi override cục bộ; knowledge file là protocol được bundle phát hành kèm. Giữ phần tùy chỉnh trong khối instructions nghĩa là các bản cập nhật sau chỉ là thao tác thay attachment, không phải merge lại các chỉnh sửa của bạn.

:::tip[Tùy chỉnh instructions, đính kèm knowledge]
Persona swap, tên người dùng mặc định, guardrail riêng của đội ngũ, cách diễn đạt ưa thích: tất cả thuộc về khối instructions được dán. Knowledge file nên giữ nguyên bản gốc để bạn có thể làm mới mà không mất thay đổi.
:::

## Tự xây bundle của bạn

Web bundles được tạo từ BMad skills bằng utility skill `bmad-os-skill-to-bundle`. Trỏ nó tới bất kỳ thư mục BMad skill nào, nó sẽ tạo các file bundle với persona kế thừa từ agent sở hữu skill.

Cài bất kỳ bundle nào từ [bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/).
