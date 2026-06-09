---
title: 'Cách cài đặt BMad'
description: Cài đặt, cập nhật, và pin BMad cho phát triển cục bộ, đội nhóm, và CI
sidebar:
  order: 1
---

Dùng `npx bmad-method install` để thiết lập BMad trong dự án của bạn. Một lệnh xử lý cài đặt lần đầu, nâng cấp, chuyển channel, và các lượt chạy CI bằng script. Trang này bao quát tất cả.

## Khi nào nên dùng

- Bắt đầu một dự án mới với BMad
- Thêm hoặc gỡ module trên một bản cài đặt hiện có
- Chuyển một module sang main-HEAD hoặc pin vào một bản phát hành cụ thể
- Script hóa cài đặt cho CI pipeline, Dockerfile, hoặc rollout trong doanh nghiệp

:::note[Điều kiện tiên quyết]

- **Node.js** 20.12+ (trình cài đặt yêu cầu phiên bản này)
- **Git** (để clone module bên ngoài)
- **Một công cụ AI** như Claude Code hoặc Cursor (chạy `npx bmad-method install --list-tools` để xem tất cả công cụ được hỗ trợ)

:::

## Cài lần đầu (đường nhanh)

```bash
npx bmad-method install
```

Luồng tương tác sẽ hỏi bạn năm điều:

1. Thư mục cài đặt (mặc định là thư mục làm việc hiện tại)
2. Module cần cài (checkbox cho core, bmm, bmb, cis, gds, tea)
3. **"Ready to install (all stable)?"** - Yes sẽ chấp nhận tag phát hành mới nhất cho mọi module bên ngoài
4. Công cụ AI/IDE cần tích hợp (claude-code, cursor, và các công cụ khác)
5. Cấu hình theo từng module (tên, ngôn ngữ, thư mục output)

Chấp nhận mặc định và bạn sẽ có bản phát hành stable mới nhất của mọi module, được cấu hình cho công cụ bạn chọn.

:::tip[Chỉ muốn bản prerelease mới nhất?]

```bash
npx bmad-method@next install
```

Chạy trình cài đặt prerelease, đi kèm snapshot mới hơn của core và bmm. Nhiều biến động hơn, nhưng ít độ trễ hơn giữa phát triển và phát hành.
:::

## Chọn một phiên bản cụ thể

Hai trục độc lập quyết định nội dung cuối cùng được ghi xuống đĩa.

### Trục 1: channel của module bên ngoài

Mỗi module bên ngoài - bmb, cis, gds, tea, và mọi module cộng đồng - được cài trên một trong ba channel:

| Channel | Nội dung được cài | Ai nên chọn |
| --- | --- | --- |
| `stable` (mặc định) | Tag semver đã phát hành cao nhất. Các prerelease như `v2.0.0-alpha.1` bị loại trừ. | Hầu hết người dùng |
| `next` | HEAD của nhánh main tại thời điểm cài | Người đóng góp, early adopter |
| `pinned` | Một tag cụ thể do bạn chỉ định | Cài đặt doanh nghiệp, CI cần tái lập |

Channel là theo từng module. Bạn có thể chạy bmb trên `next` trong khi để cis trên `stable` - các cờ bên dưới cho phép trộn tự do.

### Trục 2: phiên bản binary của trình cài đặt

Chính package npm `bmad-method` có hai dist-tag:

| Lệnh | Bạn nhận được gì |
| --- | --- |
| `npx bmad-method install` (`@latest`) | Bản phát hành stable mới nhất của trình cài đặt |
| `npx bmad-method@next install` | Trình cài đặt prerelease mới nhất, tự động publish trên mỗi lần push lên main |

**Binary của trình cài đặt quyết định phiên bản core và bmm của bạn.** Hai module này được đóng gói sẵn bên trong package trình cài đặt, thay vì được clone từ repo riêng.

### Vì sao core và bmm không có channel riêng

Chúng gắn liền với binary trình cài đặt bạn đã chạy:

- `npx bmad-method install` -> core và bmm stable mới nhất
- `npx bmad-method@next install` -> core và bmm prerelease
- `node /path/to/local-checkout/tools/installer/bmad-cli.js install` -> bất kỳ nội dung nào trong checkout cục bộ của bạn

`--pin bmm=v6.3.0` và `--next=bmm` không có hiệu lực với các module bundled, và trình cài đặt sẽ cảnh báo khi bạn thử. Một bản phát hành tương lai sẽ tách bmm khỏi package trình cài đặt; khi đó bmm sẽ có bộ chọn channel đúng nghĩa như bmb hiện nay.

## Cập nhật bản cài đặt hiện có

Chạy `npx bmad-method install` trong một thư mục đã có `_bmad/` sẽ đưa cho bạn một menu:

| Lựa chọn | Tác dụng |
| --- | --- |
| **Quick Update** | Chạy lại cài đặt với cấu hình hiện có. Làm mới file, áp dụng patch và nâng cấp stable nhỏ, từ chối nâng cấp major. Nhanh, không tương tác. |
| **Modify Install** | Luồng tương tác đầy đủ. Thêm hoặc gỡ module, cấu hình lại, tùy chọn xem và đổi channel cho các module hiện có. |

### Prompt nâng cấp

Khi Modify phát hiện tag stable mới hơn cho một module bạn đã cài trên `stable`, nó phân loại diff và hỏi tương ứng:

| Loại nâng cấp | Ví dụ | Mặc định |
| --- | --- | --- |
| Patch | v1.7.0 -> v1.7.1 | Y |
| Minor | v1.7.0 -> v1.8.0 | Y |
| Major | v1.7.0 -> v2.0.0 | **N** |

Major mặc định là N vì breaking change thường xuất hiện như "không ổn định" khi người dùng không mong đợi. Prompt có kèm URL release notes trên GitHub để bạn đọc thay đổi trước khi chấp nhận.

Với `--yes`, nâng cấp patch và minor được áp dụng tự động. Major vẫn bị giữ nguyên - truyền `--pin <code>=<new-tag>` để chấp nhận theo cách không tương tác.

### Chuyển channel của một module

**Tương tác:** chọn Modify -> trả lời **Yes** cho "Review channel assignments?" -> mỗi module bên ngoài cung cấp Keep, Switch to stable, Switch to next, hoặc Pin to a tag.

**Qua cờ:** các công thức ở phần tiếp theo bao phủ các trường hợp phổ biến.

## Cài đặt Headless / CI

### Bảng cờ

| Cờ | Mục đích |
| --- | --- |
| `--yes`, `-y` | Bỏ qua mọi prompt; chấp nhận giá trị cờ + mặc định |
| `--directory <path>` | Cài vào thư mục này (mặc định: thư mục làm việc hiện tại) |
| `--modules <a,b,c>` | Tập module chính xác. Core được tự động thêm. Đây không phải delta - hãy liệt kê mọi module bạn muốn giữ. |
| `--tools <a,b>` | Lựa chọn IDE/công cụ. Bắt buộc cho cài mới với `--yes`. Chạy `--list-tools` để xem ID hợp lệ. |
| `--list-tools` | In tất cả ID công cụ/IDE được hỗ trợ (kèm thư mục đích) rồi thoát. |
| `--action <type>` | `install`, `update`, hoặc `quick-update`. Mặc định dựa trên trạng thái cài đặt hiện có. |
| `--custom-source <urls>` | Cài module tùy chỉnh từ Git URL hoặc đường dẫn cục bộ |
| `--channel <stable\|next>` | Áp dụng cho mọi module bên ngoài (alias là `--all-stable` / `--all-next`) |
| `--all-stable` | Alias cho `--channel=stable` |
| `--all-next` | Alias cho `--channel=next` |
| `--next=<code>` | Đưa một module lên next. Có thể lặp lại. |
| `--pin <code>=<tag>` | Pin một module vào tag cụ thể. Có thể lặp lại. |
| `--set <module>.<key>=<value>` | Đặt bất kỳ tùy chọn cấu hình module nào theo cách không tương tác (khuyến nghị - xem [Ghi đè cấu hình module](#ghi-đè-cấu-hình-module)). Có thể lặp lại. |
| `--list-options [module]` | In mọi key `--set` cho module built-in và official module đã cache cục bộ, rồi thoát. Truyền mã module để giới hạn vào một module. |
| `--user-name`, `--communication-language`, `--document-output-language`, `--output-folder` | Shortcut cũ tương đương `--set core.<key>=<value>` (vẫn được hỗ trợ) |

Độ ưu tiên khi các cờ chồng lên nhau: `--pin` thắng `--next=`, thắng `--channel` / `--all-*`, thắng mặc định registry (`stable`).

:::note[Ví dụ resolve]
`--all-next --pin cis=v0.2.0` đặt bmb, gds, và tea trên next trong khi pin cis vào v0.2.0.
:::

### Công thức

**Cài mặc định - stable mới nhất cho mọi thứ:**

```bash
npx bmad-method install --yes --modules bmm,bmb,cis --tools claude-code
```

**Enterprise pin - tái lập từng byte:**

```bash
npx bmad-method install --yes \
  --modules bmm,bmb,cis \
  --pin bmb=v1.7.0 --pin cis=v0.2.0 \
  --tools claude-code
```

**Bleeding edge - module bên ngoài trên main HEAD:**

```bash
npx bmad-method install --yes --modules bmm,bmb --all-next --tools claude-code
```

**Thêm module vào bản cài đặt hiện có** (giữ mọi thứ khác):

```bash
npx bmad-method install --yes --action update \
  --modules bmm,bmb,gds
```

`--tools` được bỏ qua có chủ ý - `--action update` dùng lại các công cụ đã cấu hình trong lần cài đầu.

**Trộn channel - bmb trên next, gds trên stable:**

```bash
npx bmad-method install --yes --action update \
  --modules bmm,bmb,cis,gds \
  --next=bmb
```

### Ghi đè cấu hình module

`--set <module>.<key>=<value>` cho phép bạn đặt bất kỳ tùy chọn cấu hình module nào theo cách không tương tác. Cờ này có thể lặp lại và mở rộng cho mọi module - hiện tại lẫn tương lai. Cờ được áp dụng như một patch sau cài đặt: trình cài đặt chạy luồng bình thường trước, sau đó `--set` upsert từng giá trị vào `_bmad/config.toml` (scope đội nhóm) hoặc `_bmad/config.user.toml` (scope người dùng), và vào `_bmad/<module>/config.yaml` để các giá trị đã khai báo được mang sang lần cài tiếp theo.

**Ví dụ - cài bmm với project knowledge và skill level rõ ràng:**

```bash
npx bmad-method install --yes \
  --modules bmm \
  --tools claude-code \
  --set bmm.project_knowledge=research \
  --set bmm.user_skill_level=expert
```

**Khám phá các key có sẵn cho một module:**

```bash
npx bmad-method install --list-options bmm
```

`--list-options` (không có tham số) liệt kê mọi key mà trình cài đặt có thể tìm thấy cục bộ - module built-in (`core`, `bmm`) cộng với mọi official module hiện đang được cache. Cache là theo từng máy và có thể bị xóa, nên official module từng cài trước đó sẽ không xuất hiện trên checkout mới hoặc CI worker tạm thời cho tới khi được cài lại. Community và custom module không được liệt kê ở đây; hãy đọc trực tiếp `module.yaml` của module để xem các key nó khai báo.

**Cách hoạt động:**

- **Routing.** Bước patch tìm `[modules.<module>] <key>` (hoặc `[core] <key>`) trong `config.user.toml` trước; nếu tìm thấy, nó cập nhật file đó. Nếu không, nó ghi vào `config.toml` scope đội nhóm. Vì vậy các key scope người dùng (ví dụ `core.user_name`, `bmm.user_skill_level`) nằm trong `config.user.toml`, còn key scope đội nhóm nằm trong `config.toml`, khớp với cách trình cài đặt phân vùng.
- **Giá trị nguyên văn.** Giá trị được ghi đúng như bạn cung cấp - không render template `result:`. Để có dạng đã render (ví dụ `{project-root}/research`), hãy truyền rõ ràng: `--set bmm.project_knowledge='{project-root}/research'`.
- **Mang tiếp, key đã khai báo.** Giá trị cho key được khai báo trong `module.yaml` sống sót qua các lần cài tiếp theo vì cũng được ghi vào `_bmad/<module>/config.yaml`, file mà trình cài đặt đọc làm mặc định prompt trong lần chạy sau.
- **Mang tiếp, key chưa khai báo.** Giá trị cho key không có trong schema của module sẽ được ghi vào `config.toml` cho lần cài hiện tại nhưng không được phát lại ở lần cài sau (manifest writer phân vùng nghiêm theo schema và bỏ key không biết). Hãy truyền lại `--set` nếu cần nó bền, hoặc chỉnh trực tiếp `_bmad/config.toml`.
- **Không xác thực.** Giá trị `single-select` không được kiểm tra với các lựa chọn cho phép, và key lạ không bị từ chối - bất kỳ điều gì bạn khẳng định đều được ghi.
- **Module không nằm trong `--modules`.** Đặt giá trị cho module bạn không đưa vào sẽ in cảnh báo và giá trị bị bỏ (không có file nào được tạo cho module chưa cài).

Các shortcut core cũ (`--user-name`, `--output-folder`, v.v.) vẫn hoạt động và vẫn được ghi lại để tương thích ngược, nhưng `--set core.user_name=...` là tương đương.

:::note[Hoạt động với quick-update]
`--set` là patch sau cài đặt, nên nó áp dụng giống nhau bất kể action type. Với `bmad install --action quick-update` (hoặc `--yes` trên bản cài đặt hiện có, nơi quick-update là mặc định), `--set` patch các file cấu hình trung tâm ở cuối giống như cài đặt thường.
:::

:::caution[Rate limit trên IP dùng chung]
Lời gọi GitHub API ẩn danh bị giới hạn 60/giờ trên mỗi IP. Một lượt cài đặt gọi API một lần cho mỗi module bên ngoài để resolve tag stable. Văn phòng sau NAT, pool CI runner, và VPN có thể cùng nhau dùng hết hạn mức.

Đặt `GITHUB_TOKEN=<personal access token>` trong môi trường để nâng hạn mức lên 5000/giờ trên mỗi tài khoản. PAT public-repo-read bất kỳ đều dùng được; không cần scope.
:::

## Nội dung đã được cài

Sau mọi lượt cài, `_bmad/_config/manifest.yaml` ghi lại chính xác những gì nằm trên đĩa:

```yaml
modules:
  - name: bmb
    version: v1.7.0 # tag, hoặc "main" cho next
    channel: stable # stable | next | pinned
    sha: 86033fc9aeae2ca6d52c7cdb675c1f4bf17fc1c1
    source: external
    repoUrl: https://github.com/bmad-code-org/bmad-builder
```

Trường `sha` được ghi cho các module dựa trên git (external, community, và custom theo URL). Module bundled (core, bmm) và custom module theo đường dẫn cục bộ không có trường này - code của chúng đi cùng binary trình cài đặt hoặc filesystem của bạn, không phải một ref có thể clone.

Để tái lập giữa các máy, đừng dựa vào việc chạy lại cùng lệnh `--modules`. Cài đặt trên stable channel resolve tới tag đã phát hành cao nhất **tại thời điểm cài**, nên lần chạy sau có thể nhận bất kỳ phiên bản nào được phát hành kể từ đó. Hãy chuyển các tag đã ghi trong `manifest.yaml` thành cờ `--pin` rõ ràng trên máy đích, ví dụ:

```bash
npx bmad-method install --yes --modules bmb,cis \
  --pin bmb=v1.7.0 --pin cis=v0.4.2 --tools claude-code
```

## Khắc phục sự cố

### "Could not resolve stable tag" hoặc "API rate limit exceeded"

Bạn đã chạm giới hạn 60/giờ của GitHub ẩn danh. Đặt `GITHUB_TOKEN` rồi thử lại. Nếu đã có token, token đó có thể hết hạn hoặc bị rate-limit theo ngân sách riêng - thử token khác hoặc chờ reset theo giờ.

### "Tag 'vX.Y.Z' not found"

Tag bạn truyền cho `--pin` không tồn tại trong repo của module. Kiểm tra trang releases của repo trên GitHub để tìm tag hợp lệ.

### Bản cài pinned vẫn tiếp tục nâng cấp

Bản cài pinned không nâng cấp. Quick-update chỉ áp dụng patch và minor trên stable channel; nó không chạm vào `pinned` hoặc `next`. Nếu một bản cài pinned đã thay đổi, hãy mở `_bmad/_config/manifest.yaml` - `channel: pinned` cộng với `version` và `sha` cố định phải được giữ qua các lần chạy trừ khi bạn ghi đè rõ ràng bằng cờ.

### `--pin bmm=X` không làm gì

bmm là module bundled - `--pin` và `--next=` không áp dụng. Dùng `npx bmad-method@next install` để lấy core/bmm prerelease, hoặc checkout repo bmad-bmm và chạy trình cài đặt cục bộ để nhận thay đổi chưa phát hành.
