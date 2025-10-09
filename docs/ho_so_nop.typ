#import "@preview/basic-report:0.3.1": *

#show: it => basic-report(
  doc-category: "Công Nghệ Phần Mềm Chuyên Sâu - SE214.Q11

Đề tài 5: Layered / Domain-Driven Design + Extreme Programming (XP) — Hệ thống 
Quản lý Học tập (LMS) ",
  doc-title: "Báo cáo Sprint 1",
  author: "23521224 Trương Hoàng Phúc
23521736 Bùi Văn Tùng
23520657 Vũ Quốc Huy
23520466 Tạ Hoàng Hiệp
23520682 Đỗ Đình Khang
23520448 Nguyễn Văn Hào
23520557 Dương Quốc Hưng",
  language: "vi",
  compact-mode: false,
  it
)

#set page(margin: 1.75in)
#set par(leading: 0.55em, spacing: 0.55em, first-line-indent: 1.8em, justify: true)
#show heading: set block(above: 1.4em, below: 1em)

= Kế hoạch thực hiện

Mục này bao gồm kế hoạch thực hiện theo từng Sprint

#include "sprint_backlog.typ"

= Product Backlog

Mục này gồm các use case của hệ thống.

#include "product_backlog.typ"


= Tổ chức nhóm

- Nhóm đối ngoại: chuẩn bị tài liệu và báo cáo, phân tích, giao tiếp với khách hàng, quản lí, đảm bảo tiến độ của sản phẩm  
  + **Trương Hoàng Phúc:** Product Owner, phụ trách làm trưởng nhóm, chia công việc, và deploy sản phẩm  
  + **Tạ Hoàng Hiệp, Đỗ Đình Khang:** Scrum Master, làm tài liệu, phân tích, thiết kế Figma  

- Nhóm đối nội: tập trung phát triển phần mềm  
  + **Front-End Team (FET):** Vũ Quốc Huy, Nguyễn Văn Hào — phát triển giao diện  
  + **Back-End Team (BET):** Bùi Văn Tùng, Dương Quốc Hưng — phát triển hệ thống  

- Chia việc đầy đủ cho tất cả thành viên trên Project repo:  
  https://github.com/users/Huangphoux/projects/2  
- Phổ biến về việc cần nộp Pair Programming Log  
- Hướng dẫn FET về công việc cần làm  
- Deploy Front-End: https://uit-limousine.netlify.app/

= Công cụ

Zalo, Discord

= Hình ảnh

#image("minh_chung/hoi_thay_7_thang_10.jpg")
#image("minh_chung/minh_chung_zalo_7_thang_10.png")
#image("minh_chung/minh_chung_discord_7_thang_10.png")
