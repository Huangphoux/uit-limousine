#import "@preview/basic-report:0.3.1": *

#show: it => basic-report(
  doc-category: "Công nghệ phần mềm chuyên sâu - SE214.Q11
Bài tập thực hành lần 2",
  doc-title: "Docker hóa và Deploy ứng dụng từ source code có sẵn",
  author: "Nhóm 5

23521224 Trương Hoàng Phúc
23521736 Bùi Văn Tùng
23520657 Vũ Quốc Huy
23520466 Tạ Hoàng Hiệp
23520682 Đỗ Đình Khang
23520448 Nguyễn Văn Hào
23520557 Dương Quốc Hưng",
  language: "vi",
  compact-mode: false,
  // heading-font: "New Computer Modern",
  heading-color: black,
  show-outline: true,
  it,
)

#set page(margin: 1.75in)
#set par(leading: 0.55em, spacing: 0.55em, first-line-indent: 1.8em, justify: true)
#show heading: set block(above: 1.4em, below: 1em)
// #show raw: set text(font: "JetBrains Mono")
// #set text(font: "New Computer Modern")

#show link: underline


= Phân tích source code
#include "phan_tich_source_code.typ"

= Docker hoá ứng dụng
#include "dockerfiles.typ"

// 1 đứa sửa và chạy Dockerfile trong client sao cho không lỗi rồi báo cho người còn lại
// 1 đứa trình bày trong báo cáo: giải thích từng dòng lệnh trong Dockerfile, chụp hình kết quả

// 1 đứa sửa và chạy Dockerfile trong server sao cho không lỗi rồi báo cho người còn lại
// 1 đứa trình bày trong báo cáo: giải thích từng dòng lệnh trong Dockerfile, chụp hình kết quả

= Deploy bằng Docker Compose
#include "docker-compose.typ"

// 1 đứa sửa và chạy Dockerfile trong client sao cho không lỗi rồi báo cho người còn lại
// 1 đứa trình bày trong báo cáo: giải thích từng dòng lệnh trong Dockerfile, chụp hình kết quả

= Bản tự đánh giá và đóng góp cá nhân
== Trương Hoàng Phúc 23521224
#include "phuc.typ"

== Bùi Văn Tùng 23521736
#include "tung.typ"

== Vũ Quốc Huy 23520657
#include "huy.typ"

== Tạ Hoàng Hiệp 23520466
#include "hiep.typ"

== Đỗ Đình Khang 23520682
#include "khang.typ"

== Nguyễn Văn Hào 23520448
#include "hao.typ"

== Dương Quốc Hưng 23520557
#include "hung.typ"

