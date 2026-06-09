---
title: "Sơ đồ workflow"
description: Tài liệu trực quan về các giai đoạn workflow và đầu ra của BMad Method
sidebar:
  order: 1
---

BMad Method (BMM) là một module trong hệ sinh thái BMad, hướng tới các best practice của context engineering và lập kế hoạch. AI agent hoạt động tốt nhất khi có context rõ ràng, có cấu trúc. Hệ thống BMM xây dựng context đó dần dần qua 4 giai đoạn riêng biệt - mỗi giai đoạn, cùng nhiều workflow tùy chọn trong từng giai đoạn, tạo ra tài liệu làm đầu vào cho giai đoạn tiếp theo, để agent luôn biết cần xây gì và vì sao.

Lý do và các khái niệm nền tảng đến từ các phương pháp agile đã được dùng rộng rãi trong ngành với hiệu quả cao như một khung tư duy.

Nếu có lúc nào bạn không chắc nên làm gì, skill `bmad-help` sẽ giúp bạn đi đúng hướng hoặc biết bước tiếp theo. Bạn luôn có thể dùng trang này để tham chiếu, nhưng `bmad-help` hoàn toàn tương tác và nhanh hơn nhiều nếu bạn đã cài BMad Method. Ngoài ra, nếu bạn dùng các module khác mở rộng BMad Method hoặc thêm các module bổ trợ không phải extension, `bmad-help` cũng tiến hóa để biết mọi thứ đang có và đưa ra lời khuyên tốt nhất tại thời điểm đó.

Lưu ý quan trọng cuối cùng: mọi workflow bên dưới đều có thể chạy trực tiếp bằng công cụ bạn chọn thông qua skill, hoặc bằng cách nạp agent trước rồi chọn entry từ menu agent.

<iframe src="/workflow-map-diagram.html" title="BMad Method Workflow Map Diagram" width="100%" height="100%" style="border-radius: 8px; border: 1px solid #334155; min-height: 900px;"></iframe>

<p style="font-size: 0.8rem; text-align: right; margin-top: -0.5rem; margin-bottom: 1rem;">
  <a href="/workflow-map-diagram.html" target="_blank" rel="noopener noreferrer">Mở sơ đồ trong tab mới ↗</a>
</p>

## Giai đoạn 1: Phân tích (tùy chọn)

Khám phá không gian vấn đề và xác thực ý tưởng trước khi cam kết đi vào lập kế hoạch. [**Tìm hiểu từng công cụ làm gì và nên dùng khi nào**](../explanation/analysis-phase.md).

| Workflow | Mục đích | Tạo ra |
| --- | --- | --- |
| `bmad-brainstorming` | Brainstorm ý tưởng dự án với sự điều phối có hướng dẫn của brainstorming coach | `brainstorming-report.md` |
| `bmad-domain-research`, `bmad-market-research`, `bmad-technical-research` | Xác thực giả định thị trường, kỹ thuật, hoặc domain | Kết quả nghiên cứu |
| `bmad-product-brief` | Ghi lại tầm nhìn chiến lược - phù hợp nhất khi concept của bạn đã rõ | `product-brief.md` |
| `bmad-prfaq` | Working Backwards - stress-test và rèn chắc concept sản phẩm | `prfaq-{project}.md` |

## Giai đoạn 2: Lập kế hoạch

Xác định cần xây gì và xây cho ai.

| Workflow | Mục đích | Tạo ra |
| --- | --- | --- |
| `bmad-prd` | Tạo, cập nhật, hoặc xác thực PRD - coached discovery, ba intent trong một skill | Create/Update: `prd.md`, `addendum.md`, `decision-log.md`; Validate: `validation-report.html` + `.md` |
| `bmad-ux` | Thiết kế trải nghiệm người dùng (khi UX quan trọng) - cặp xương sống DESIGN.md (trực quan) + EXPERIENCE.md (hành vi) | `DESIGN.md`, `EXPERIENCE.md`, `.decision-log.md` |

:::tip[Ba intent trong một skill]
`bmad-prd` xử lý toàn bộ vòng đời PRD. Hãy nêu intent khi gọi skill, nếu không skill sẽ hỏi:

- **Create** - PRD mới từ đầu thông qua coached discovery; tạo `prd.md`, `addendum.md`, và `decision-log.md`
- **Update** - reconcile PRD hiện có với tín hiệu thay đổi, làm lộ xung đột trước khi áp dụng thay đổi
- **Validate** - critique PRD theo checklist có thể cấu hình và tạo báo cáo phát hiện HTML có cấu trúc
:::

:::tip[Upstream: `bmad-product-brief`]
`bmad-product-brief` (Giai đoạn 1) tạo `product-brief.md` để `bmad-prd` có thể source-extract trong Discovery, giảm việc giải thích lại và giữ hai tài liệu thẳng hàng. Không skill nào bắt buộc skill kia - hãy bắt đầu trực tiếp với `bmad-prd` nếu bạn đã biết mình đang xây gì.
:::

## Giai đoạn 3: Định hình giải pháp

Quyết định cách xây và chia nhỏ công việc thành story.

| Workflow | Mục đích | Tạo ra |
| --- | --- | --- |
| `bmad-create-architecture` | Làm rõ các quyết định kỹ thuật | `architecture.md` kèm ADR |
| `bmad-create-epics-and-stories` | Phân rã yêu cầu thành công việc có thể triển khai | File epic có story |
| `bmad-check-implementation-readiness` | Gate check trước khi triển khai | Quyết định PASS/CONCERNS/FAIL |

## Giai đoạn 4: Triển khai

Xây từng story một. Tự động hóa toàn bộ giai đoạn 4 sẽ sớm ra mắt.

| Workflow | Mục đích | Tạo ra |
| --- | --- | --- |
| `bmad-sprint-planning` | Khởi tạo theo dõi (một lần mỗi dự án để sắp thứ tự chu trình dev) | `sprint-status.yaml` |
| `bmad-create-story` | Chuẩn bị story tiếp theo cho implementation | `story-[slug].md` |
| `bmad-dev-story` | Triển khai story | Code chạy được + tests |
| `bmad-code-review` | Xác thực chất lượng implementation | Được duyệt hoặc yêu cầu thay đổi |
| `bmad-correct-course` | Xử lý thay đổi lớn giữa sprint | Kế hoạch cập nhật hoặc định tuyến lại |
| `bmad-sprint-status` | Theo dõi tiến độ sprint và trạng thái story | Cập nhật trạng thái sprint |
| `bmad-retrospective` | Review sau khi hoàn tất epic | Bài học rút ra |
| `bmad-investigate` | Điều tra pháp chứng với phát hiện được phân cấp bằng chứng, hiệu chỉnh theo input | `{slug}-investigation.md` |

## Luồng nhanh (nhánh song song)

Bỏ qua giai đoạn 1-3 cho các việc nhỏ, rõ, và đã hiểu đầy đủ.

| Workflow | Mục đích | Tạo ra |
| --- | --- | --- |
| `bmad-quick-dev` | Luồng nhanh hợp nhất - làm rõ intent, lập kế hoạch, triển khai, review, và trình bày | `spec-*.md` + code |

## Quản lý context

Mỗi tài liệu trở thành context cho giai đoạn tiếp theo. PRD cho architect biết ràng buộc nào quan trọng. Architecture cho dev agent biết pattern nào cần theo. File story cung cấp context tập trung, đầy đủ cho implementation. Không có cấu trúc này, agent sẽ đưa ra quyết định thiếu nhất quán.

### Bối cảnh dự án

:::tip[Khuyến nghị]
Tạo `project-context.md` để đảm bảo AI agent tuân theo quy tắc và preference của dự án. File này hoạt động như một bản hiến pháp cho dự án - nó dẫn dắt quyết định implementation xuyên suốt mọi workflow. File tùy chọn này có thể được tạo ở cuối Architecture Creation, hoặc trong một dự án hiện có cũng có thể được tạo để ghi lại những điều quan trọng cần giữ thẳng hàng với convention hiện tại.
:::

**Cách tạo:**

- **Thủ công** - Tạo `_bmad-output/project-context.md` với tech stack và quy tắc implementation của bạn
- **Tự sinh** - Chạy `bmad-generate-project-context` để tự sinh từ architecture hoặc codebase

[**Tìm hiểu thêm về project-context.md**](../explanation/project-context.md)
