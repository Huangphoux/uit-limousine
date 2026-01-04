#set heading(offset: 2)
#show link: underline

= Công việc cá nhân
- Viết hai `Dockerfile` và `docker-compose.yml` cho đồ án của môn SE357 (Kỹ thuật phân tích yêu cầu), sau đó dùng repo của đồ án đó làm xuất phát điểm cho đồ án của môn SE214 (Công nghệ phần mềm chuyên sâu).
  - #link("https://github.com/Huangphoux/uit-SE357_requirement/commit/e278cf139790492cf852b107f443fc167b8e241d")[Commit] tạo `Dockerfile` và `docker-compose.yml`
  - #link("https://github.com/Huangphoux/uit-limousine/commit/07af702aeb636ca02b0b4e78e46bbb251afcee82")[Commit] đầu tiên của đồ án SE214
- Viết xuất phát điểm cho báo cáo: `bao_cao.typ`
- Điều hướng các thành viên còn lại trong nhóm cách làm bài

= Kiến thức nắm rõ
- Cách viết Dockerfile

= Khó khăn kỹ thuật
- Cách để sử dụng tính năng Hot Reload của Node trong container
  - Trên Linux, khi `docker compose up --build` xong, sửa tệp là Node trong container sẽ tự động khởi động lại
  - Do hệ thống lưu trữ tệp của Windows nên không thể làm việc trên ở trên Windows.
  - Cần phải sử dụng Dev Container
  - Không áp dụng trong môn này, vấn đề trên xảy ra ở đồ án của môn khác

= Mức độ đóng góp trong bài tập
- Khoảng 80%
  - Chuẩn bị 3 tệp `Dockerfile` cho Client và Server, cùng với `docker-compose.yml` ngay từ đầu học kì
  - Viết mẫu báo cáo và trình bày dễ hiểu nhất để các thành viên còn lại có thể tự làm hoặc nhờ `ai` khác làm giùm


