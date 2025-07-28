
# Tài liệu dự án API Quản lý Sinh viên

## Tổng quan dự án

Đây là một ứng dụng web API được xây dựng bằng **NestJS**, một framework Node.js mạnh mẽ để xây dựng các ứng dụng phía máy chủ hiệu quả và có khả năng mở rộng. Ứng dụng này quản lý thông tin của Sinh viên và các Khóa học của họ, sử dụng cơ sở dữ liệu **MongoDB** để lưu trữ dữ liệu và **Mongoose** làm cầu nối để tương tác với MongoDB một cách có cấu trúc.

Ngoài ra, dự án còn tích hợp **Swagger** để tự động tạo tài liệu API (API documentation) và cung cấp một giao diện người dùng để dễ dàng kiểm tra các API.

---

## 1. Cấu trúc thư mục

Dưới đây là cấu trúc thư mục quan trọng của dự án, giúp tổ chức code một cách logic và dễ bảo trì.

```
nest-student-api/
├── node_modules/      # Chứa các thư viện và dependency của dự án
├── src/
│   ├── app.controller.ts  # Controller chính của ứng dụng
│   ├── app.module.ts      # Module gốc, nơi kết nối tất cả các module khác
│   ├── app.service.ts     # Service chính của ứng dụng
│   ├── main.ts            # Điểm khởi đầu (entry point) của ứng dụng
│   ├── seeder.ts          # File cấu hình để chạy seeder
│   │
│   ├── students/          # Thư mục chứa mọi thứ liên quan đến "Student"
│   │   ├── dto/
│   │   │   ├── create-student.dto.ts  # Định nghĩa dữ liệu đầu vào khi tạo Student
│   │   │   └── update-student.dto.ts  # Định nghĩa dữ liệu đầu vào khi cập nhật Student
│   │   ├── schemas/
│   │   │   └── student.schema.ts      # Định nghĩa cấu trúc (model) của Student trong DB
│   │   ├── students.controller.ts   # Xử lý các request HTTP cho Student
│   │   ├── students.module.ts       # Module của Student
│   │   ├── students.service.ts      # Chứa logic nghiệp vụ cho Student
│   │   └── students.seeder.ts       # Chứa logic để tạo dữ liệu mẫu cho Student
│   │
│   └── courses/           # Thư mục chứa mọi thứ liên quan đến "Course"
│       ├── dto/
│       │   ├── create-course.dto.ts   # Định nghĩa dữ liệu đầu vào khi tạo Course
│       │   └── update-course.dto.ts   # Định nghĩa dữ liệu đầu vào khi cập nhật Course
│       ├── schemas/
│       │   └── course.schema.ts       # Định nghĩa cấu trúc (model) của Course trong DB
│       ├── courses.controller.ts    # Xử lý các request HTTP cho Course
│       ├── courses.module.ts        # Module của Course
│       ├── courses.service.ts       # Chứa logic nghiệp vụ cho Course
│       └── courses.seeder.ts        # Chứa logic để tạo dữ liệu mẫu cho Course
│
├── .env                 # Chứa các biến môi trường (ví dụ: chuỗi kết nối DB)
├── package.json         # Quản lý các dependency và script của dự án
└── tsconfig.json        # Cấu hình cho TypeScript
```

---

## 2. Các file và hàm chính

#### `src/main.ts`
Đây là file khởi chạy ứng dụng.
- `bootstrap()`: Hàm chính để khởi tạo NestJS application.
- `NestFactory.create(AppModule)`: Tạo một instance của ứng dụng dựa trên module gốc là `AppModule`.
- `app.useGlobalPipes(new ValidationPipe())`: Kích hoạt **ValidationPipe** trên toàn ứng dụng. Pipe này sẽ tự động kiểm tra dữ liệu đầu vào của các request dựa trên các DTO.
- `SwaggerModule.createDocument()` và `SwaggerModule.setup()`: Cấu hình và khởi tạo Swagger để tạo giao diện tài liệu API tại địa chỉ `/api`.

#### `src/app.module.ts`
Đây là module trung tâm, nơi liên kết các thành phần lại với nhau.
- `MongooseModule.forRootAsync()`: Kết nối ứng dụng với cơ sở dữ liệu MongoDB. Nó được cấu hình để đọc chuỗi kết nối từ file `.env`, giúp bảo mật và linh hoạt hơn.
- `imports: [StudentsModule, CoursesModule, ...]` : Import các module tính năng (feature modules) để ứng dụng nhận biết và sử dụng chúng.

#### `src/students/` (Tương tự cho `src/courses/`)

- **`student.schema.ts`**:
  - Sử dụng decorator `@Schema()` của Mongoose để định nghĩa một collection trong MongoDB.
  - `@Prop()`: Định nghĩa các trường (field) trong collection như `name`, `address`, `phone`, `dob` cùng với các thuộc tính như `required: true`.

- **`create-student.dto.ts` (Data Transfer Object)**:
  - Là một class định nghĩa cấu trúc dữ liệu khi client gửi request để tạo mới một sinh viên.
  - Sử dụng các decorator của `class-validator` (ví dụ: `@IsString()`, `@IsNotEmpty()`) để ràng buộc dữ liệu.
  - `@ApiProperty()`: Decorator của Swagger để cung cấp thông tin về các trường cho tài liệu API.

- **`students.service.ts`**:
  - Chứa toàn bộ logic xử lý nghiệp vụ.
  - `@Injectable()`: Đánh dấu class này là một Provider, có thể được inject vào các thành phần khác (như Controller).
  - `@InjectModel(Student.name)`: Inject model `Student` của Mongoose vào service để có thể tương tác với database.
  - **Các hàm chính**:
    - `create()`: Tạo một sinh viên mới.
    - `findAll()`: Lấy danh sách tất cả sinh viên.
    - `findOne()`: Tìm một sinh viên theo ID.
    - `update()`: Cập nhật thông tin sinh viên.
    - `remove()`: Xóa một sinh viên.
    - `findByName()`: Tìm sinh viên theo tên.

- **`students.controller.ts`**:
  - Chịu trách nhiệm nhận request từ client và trả về response.
  - `@Controller('students')`: Định nghĩa route gốc cho controller này là `/students`.
  - `@Get()`, `@Post()`, `@Patch(':id')`, `@Delete(':id')`: Các decorator định nghĩa các endpoint cho các phương thức HTTP tương ứng.
  - `@Body()`, `@Param('id')`, `@Query('name')`: Các decorator để lấy dữ liệu từ request body, URL parameter và query string.
  - Controller gọi các hàm tương ứng trong `StudentsService` để xử lý logic.

---

## 3. Giải thích các khái niệm

#### Seeder là gì?
- **Khái niệm**: "Seeder" (gieo dữ liệu) là một kịch bản (script) dùng để thêm dữ liệu ban đầu hoặc dữ liệu mẫu vào cơ sở dữ liệu.
- **Tại sao cần dùng?**:
  1.  **Phát triển**: Giúp lập trình viên có sẵn dữ liệu để làm việc ngay từ đầu mà không cần phải nhập tay.
  2.  **Kiểm thử (Testing)**: Tạo ra một môi trường dữ liệu nhất quán để chạy các bài test tự động.
  3.  **Demo**: Dùng để trình diễn sản phẩm với dữ liệu mẫu sinh động.
- **Cách hoạt động trong dự án này**:
  - Tôi đã sử dụng thư viện `nestjs-seeder`.
  - File `src/seeder.ts` là file cấu hình chính để chạy seeder. Nó import các module Mongoose và các file seeder cụ thể.
  - Các file như `src/students/students.seeder.ts` định nghĩa logic cho việc tạo dữ liệu. Mỗi seeder class có 2 hàm:
    - `seed()`: Chứa logic tạo và chèn dữ liệu vào database (sử dụng `DataFactory` để tạo dữ liệu ngẫu nhiên).
    - `drop()`: Chứa logic xóa toàn bộ dữ liệu trong collection, hữu ích khi cần làm sạch DB.
  - Lệnh `npm run seed` được thêm vào `package.json` để thực thi file `seeder.ts` bằng `ts-node`.

#### Swagger là gì?
- **Khái niệm**: Swagger (hay OpenAPI) là một bộ công cụ giúp thiết kế, xây dựng, và tài liệu hóa các API RESTful.
- **Tại sao cần dùng?**:
  1.  **Tài liệu hóa tự động**: Tự động tạo ra một trang web tài liệu API chi tiết từ code của bạn.
  2.  **Giao diện tương tác**: Cung cấp một UI nơi bạn (hoặc người khác) có thể trực tiếp gửi request đến các API để kiểm thử mà không cần dùng Postman hay các công cụ khác.
  3.  **Đồng bộ**: Vì tài liệu được sinh ra từ code, nó luôn đồng bộ với các API hiện có.
- **Cách hoạt động trong dự án này**:
  - Thư viện `@nestjs/swagger` được cài đặt.
  - Trong `main.ts`, `DocumentBuilder` được dùng để tạo cấu hình cơ bản (tiêu đề, mô tả), sau đó `SwaggerModule` tạo và hiển thị tài liệu tại route `/api`.
  - Các decorator `@ApiTags()` trong controller và `@ApiProperty()` trong DTO giúp Swagger hiểu và phân loại các API và các thuộc tính dữ liệu một cách rõ ràng hơn.

---

## 4. Cách chạy ứng dụng

Để chạy toàn bộ dự án, bạn cần thực hiện các bước sau:

1.  **Cài đặt Dependencies**:
    ```bash
    npm install
    ```

2.  **Khởi động MongoDB**: Đảm bảo MongoDB server của bạn đang chạy trên máy.

3.  **Gieo dữ liệu (Seeding)**: Chạy lệnh sau để thêm dữ liệu mẫu vào database.
    ```bash
    npm run seed
    ```

4.  **Chạy ứng dụng**:
    ```bash
    npm run start:dev
    ```

5.  **Truy cập**:
    - **API**: Các endpoint sẽ có tại `http://localhost:3000`.
    - **Swagger UI**: Mở trình duyệt và truy cập `http://localhost:3000/api` để xem tài liệu và kiểm thử API.
