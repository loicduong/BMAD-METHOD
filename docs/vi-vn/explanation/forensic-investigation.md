---
title: "Điều tra pháp chứng"
description: Cách bmad-investigate xem mỗi vấn đề như một hiện trường, phân cấp bằng chứng, và tạo case file có cấu trúc để kỹ sư hành động
sidebar:
  order: 10
---

Bạn đưa cho `bmad-investigate` một crash log, stack trace, hoặc chỉ một câu "trước đây chạy được, giờ thì không". Skill sẽ đảm nhận kỷ luật của một điều tra viên trong suốt lượt chạy. Nó không bắt đầu sửa ngay. Nó mở một case file.

Mỗi phát hiện đều được phân cấp. Mỗi giả thuyết đều có trạng thái. Các hướng đi sai được giữ lại, không bị xóa. Sản phẩm bàn giao là một tài liệu mà một kỹ sư khác có thể đọc từ đầu mà vẫn nắm được việc.

Trang này giải thích vì sao điều tra là một kỷ luật riêng, và skill này mang lại điều gì mà workflow dev thông thường không có.

## Vấn đề với kiểu "cứ debug đi"

Debug thông thường trộn ba việc lại với nhau: nhìn bằng chứng, suy luận nguyên nhân, và đổi code để kiểm tra lý thuyết. Khi chúng bị trộn lẫn, hai kiểu thất bại thường xuất hiện.

Thứ nhất là **khóa chặt vào câu chuyện**. Câu chuyện hợp lý đầu tiên trở thành giả thuyết làm việc, và mọi quan sát bị bẻ cong để khớp với nó. Bug vẫn không được sửa cho tới khi có người bỏ cuộc và bắt đầu lại. Nhiều giờ sau.

Thứ hai là **quên bằng chứng**. Bạn đã lần theo một hướng, đã loại trừ nó, nhưng không ghi lại vì sao. Hai ngày sau, với góc nhìn mới, bạn lần theo nó lần nữa. Hoặc tệ hơn, một đồng nghiệp tiếp nhận bug và chạy lại đúng ngõ cụt bạn đã loại bỏ.

Thiết kế của skill là phản hồi trực tiếp cho cả hai vấn đề này.

## Phân cấp bằng chứng

Mỗi phát hiện trong một cuộc điều tra thuộc một trong ba loại.

- **Đã xác nhận.** Được quan sát trực tiếp trong log, code, hoặc dump; có trích dẫn cụ thể (một `path:line`, timestamp log, hoặc commit hash). Nếu ai hỏi "làm sao bạn biết?", bạn chỉ vào trích dẫn.
- **Suy ra.** Hệ quả logic từ bằng chứng đã xác nhận; chuỗi suy luận được trình bày. Nếu một bước trong chuỗi sai, kết luận suy ra cũng sai, và bạn thấy chính xác bước nào.
- **Giả thuyết.** Hợp lý nhưng chưa được xác nhận. Nêu rõ bằng chứng nào sẽ xác nhận hoặc bác bỏ, và nói trước điều gì sẽ đóng nó lại. Giả thuyết rõ ràng *không phải sự thật*.

Việc phân cấp không phải để tỏ ra khiêm tốn. Nó giúp case file dễ đọc. Người đọc có thể lướt phần Đã xác nhận để biết điều gì là đúng, phần Suy ra để biết điều gì kéo theo từ đó, và phần Giả thuyết để biết điều gì vẫn còn mở. Nhầm lẫn giữa ba loại này là lý do phổ biến nhất khiến điều tra bị xoáy vòng.

## Stronghold trước

Điều tra không bao giờ bắt đầu từ một lý thuyết. Nó bắt đầu từ một mẩu bằng chứng đã xác nhận rồi mở rộng ra ngoài. Bằng chứng đó có thể là một thông báo lỗi cụ thể, một stack frame, hoặc một dòng log có timestamp.

Điều này trái ngược với cách điều tra thường diễn ra. Ai đó có linh cảm, dựng một lý thuyết, rồi săn bằng chứng ủng hộ nó. Linh cảm có thể đúng; nhưng *phương pháp* thì mong manh vì nó biến confirmation bias thành mặc định.

Stronghold là một sự thật bạn có thể quay lại khi suy luận trở nên mờ mịt. Nếu một suy luận đưa bạn tới chỗ kỳ lạ, bạn có thể lần ngược về stronghold và thử nhánh khác. Không có stronghold, bạn không biết phải hoàn tác bước nào.

Khi bằng chứng ít, skill nói rõ điều đó và chuyển sang khám phá dựa trên giả thuyết: tạo giả thuyết từ những gì đang có, xác định điều gì sẽ kiểm tra từng giả thuyết, rồi trình bày danh sách thu thập dữ liệu theo ưu tiên. Thiếu bằng chứng tự nó cũng là một phát hiện.

## Kỷ luật giả thuyết

Giả thuyết không bao giờ bị xóa khỏi case file. Khi bằng chứng xác nhận hoặc bác bỏ một giả thuyết, trường **Status** của nó chuyển từ Open sang Confirmed hoặc Refuted, và phần **Resolution** giải thích bằng chứng nào đã chốt nó.

Quy tắc này có chi phí thật. Case file sẽ dài ra. Lợi ích cũng thật. Toàn bộ lịch sử suy luận trở thành một phần của sản phẩm bàn giao. Sáu tháng sau, khi một bug tương tự xuất hiện, điều tra viên tiếp theo có thể đọc case file ban đầu và thấy những đường nào đã bị loại bỏ và vì sao. Không có lịch sử đó, mỗi điều tra viên mới lại chạy lại cùng các ngõ cụt.

Nó cũng rèn kỷ luật cho điều tra viên ở hiện tại. Nếu bạn không thể xóa một giả thuyết sai, bạn phải bác bỏ nó bằng bằng chứng có trích dẫn. Việc âm thầm bỏ qua nó khi nó trở nên bất tiện không còn là lựa chọn.

## Thách thức tiền đề

Mô tả vấn đề của người dùng là một giả thuyết, không phải sự thật. "Cache bị hỏng" là điều người dùng *tin*. Trước khi skill xây một cuộc điều tra quanh nó, các tuyên bố kỹ thuật sẽ được xác minh độc lập. Nếu bằng chứng mâu thuẫn với tiền đề, báo cáo sẽ nói thẳng.

Đây là bản năng pháp chứng: lời kể của nhân chứng là dữ liệu, không phải chân lý. Đôi khi bug được báo là thật nhưng bị gắn nhãn sai. Đôi khi triệu chứng được mô tả là hệ quả downstream của một nguyên nhân khác. Những cuộc điều tra xem tiền đề là chân lý sẽ chẩn đoán sai lỗi, và bug quay lại dưới một hình thức hơi khác.

## Một bước đi được hiệu chỉnh

Skill là một quy trình, không phải hai chế độ. Nó hiệu chỉnh liên tục mức độ cần săn lỗi so với mức độ cần khám phá khu vực, tùy theo input yêu cầu.

Một case dựa trên triệu chứng (ticket, crash, thông báo lỗi, một câu "trước đây chạy được") sẽ nghiêng về theo dõi giả thuyết, tái dựng timeline, và hướng sửa. Một case không có triệu chứng (hiểu một module trước khi chạm vào nó, đánh giá khả năng tái sử dụng, xây mental model) sẽ nghiêng về mapping I/O, lọc control-flow, và kế hoạch xác minh. Hầu hết case thực tế nằm đâu đó giữa hai đầu này, và case file phản ánh tỷ lệ mà bằng chứng yêu cầu.

Kỷ luật là như nhau bất kể case nằm ở đâu trên thang đó: stronghold trước, phân cấp bằng chứng, theo dõi giả thuyết, không xóa lịch sử. Output luôn nằm ở `{implementation_artifacts}/investigations/{slug}-investigation.md`, với các phần không áp dụng cho case cụ thể được để trống hoặc bỏ qua.

Khi một bug sâu đòi hỏi hiểu một subsystem rộng hơn, quy trình sẽ gộp trực tiếp các kỹ thuật mapping I/O, lọc control-flow, làm ngược từ output, và lần theo ranh giới giữa các component. Mô hình khu vực được đặt trong cùng case file. Không có chuyển chế độ.

## Methodology nằm trong skill

Kỷ luật của điều tra viên là thuộc tính của chính skill. Bất kỳ ai gọi `bmad-investigate` sẽ đảm nhận methodology và phong cách giao tiếp đó trong lượt chạy: độ chính xác lâm sàng, ngôn ngữ đi từ bằng chứng, không nói nước đôi, framing bằng case file. Khi skill kết thúc, người gọi quay lại giọng trước đó. Không đổi persona, chỉ là đổi sắc thái theo nguyên tắc của skill.

Điều này quan trọng vì điều tra và triển khai tưởng thưởng các bản năng khác nhau. Điều tra viên chậm và chính xác. Người triển khai nhanh và tự tin. Cùng một bộ não làm cả hai trong một phiên thường làm không tốt cả hai. Skill tách riêng tư thế điều tra ngay trong luồng làm việc, không cần chuyển context sang một danh tính riêng.

## Bạn nhận được gì

Một file điều tra hoàn chỉnh:

- Tách phát hiện Đã xác nhận (có trích dẫn) khỏi Suy luận và Giả thuyết
- Giữ lại mọi giả thuyết từng được tạo, cùng Status và Resolution cuối cùng
- Tái dựng timeline sự kiện từ nhiều nguồn bằng chứng
- Xác định gap dữ liệu và chúng sẽ giải quyết điều gì
- Đưa ra kết luận có thể hành động, được neo bằng bằng chứng
- Bao gồm kế hoạch tái hiện khi xác định được root cause
- Duy trì backlog điều tra cho các hướng vẫn cần khám phá

Đưa nó cho một kỹ sư không có mặt trong phiên, họ vẫn hiểu chuyện gì đã xảy ra, điều gì đã biết, và điều gì còn bất định. Đó là tiêu chuẩn.

## Ý tưởng lớn hơn

Hầu hết "AI debugging" hiện nay trộn bằng chứng, suy luận, và thay đổi code vào một dòng văn bản nghe có vẻ hợp lý. Tín hiệu khó tìm, ngõ cụt lặp lại, và case file, nếu có, thường chỉ là chat log mà không ai muốn đọc.

`bmad-investigate` xem điều tra như một kỷ luật có sản phẩm bàn giao riêng. Bằng chứng có cấp độ. Giả thuyết có trạng thái. Hướng đi sai được ghi lại, không bị xóa. Case file sống lâu hơn phiên làm việc.

Khi bug tiếp theo xuất hiện và trông giống một bug bạn từng thấy, bạn có chỗ để bắt đầu thay vì một prompt trắng.
