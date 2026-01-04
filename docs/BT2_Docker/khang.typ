#set heading(offset: 2)

= Phần công việc cá nhân đã thực hiện
Trong bài thực hành này, em đã đảm nhận công việc viết Dockerfile cho phần client của ứng dụng. Trong đó:

- Xây dựng Dockerfile cho client sử dụng base image `node:latest`, thiết lập working directory là `/app`
- Cấu hình quá trình build bao gồm: copy file `package.json` và `package-lock.json`, chạy lệnh `npm install` để cài đặt dependencies
- Thiết lập command khởi động với `npm run dev -- --host 0.0.0.0` để cho phép truy cập từ bên ngoài container
- Kiểm thử Dockerfile bằng cách build image và chạy container độc lập để đảm bảo client hoạt động đúng

= Phần kiến thức cá nhân nắm rõ nhất
Với bài thực hành, em đã nắm vững kiến thức về *Docker Image*. Docker image là một template chỉ đọc chứa tất cả những gì cần thiết để chạy một ứng dụng: code, runtime, system tools, libraries và dependencies. Nắm được quá trình tạo image từ Dockerfile thông qua các instruction như `FROM`, `WORKDIR`, `COPY`, `RUN`, `EXPOSE`, và `CMD`. 

Ngoài ra, còn có cơ chế layering của Docker image - mỗi instruction trong Dockerfile tạo ra một layer mới, và Docker sử dụng caching để tối ưu hóa thời gian build. Ví dụ, trong Dockerfile của client, em copy file `package*.json` trước và chạy `npm install` riêng biệt, sau đó mới copy toàn bộ source code. Điều này giúp tận dụng Docker cache: khi source code thay đổi nhưng dependencies không đổi, Docker không cần chạy lại `npm install`, tiết kiệm đáng kể thời gian build.

Sự khác biệt giữa Docker image và container: image là blueprint không thay đổi, còn container là instance đang chạy của image. Một image có thể tạo ra nhiều container khác nhau.

= Khó khăn kỹ thuật và cách giải quyết
Quá trình thực hiện Dockerfile cho client diễn ra khá thuận lợi và không gặp khó khăn đáng kể. Dockerfile của client tương đối đơn giản với các bước cơ bản: setup Node.js environment, install dependencies.

= Tự đánh giá mức độ đóng góp
Mức độ đóng góp của bản thân trong nhóm là *10%*. Phần công việc của em tập trung vào việc containerize phần client của ứng dụng, đây là một phần quan trọng nhưng tương đối nhỏ so với toàn bộ hệ thống bao gồm server, database và docker-compose configuration.