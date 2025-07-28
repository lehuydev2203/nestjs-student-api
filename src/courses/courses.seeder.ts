import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Course } from '../schemas/course.schema';
import { Student } from '../../students/schemas/student.schema';

@Injectable()
export class CoursesSeeder implements Seeder {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
  ) {}

  async seed(): Promise<any> {
    const students = await this.studentModel.find();
    if (students.length === 0) {
      console.log('Cannot seed courses because no students found. Please seed students first.');
      return;
    }

    const mobileCourses = [
      { name: 'Lập trình Android cơ bản', score: 0 },
      { name: 'Lập trình iOS với Swift', score: 0 },
      { name: 'React Native nâng cao', score: 0 },
      { name: 'Flutter và Dart', score: 0 },
      { name: 'Quản lý dự án Mobile', score: 0 },
      { name: 'UI/UX cho ứng dụng di động', score: 0 },
      { name: 'Kiểm thử ứng dụng di động', score: 0 },
    ];

    const coursesToInsert = [];

    for (const student of students) {
      // Gán ngẫu nhiên 3-5 môn học cho mỗi sinh viên
      const numberOfCourses = Math.floor(Math.random() * 3) + 3; // 3 to 5
      const shuffledCourses = [...mobileCourses].sort(() => 0.5 - Math.random());

      for (let i = 0; i < numberOfCourses; i++) {
        coursesToInsert.push({
          name: shuffledCourses[i].name,
          // Điểm số ngẫu nhiên từ 4.0 đến 10.0 để có sự đa dạng
          score: parseFloat((Math.random() * 6 + 4).toFixed(1)),
          student_id: student._id,
        });
      }
    }

    return this.courseModel.insertMany(coursesToInsert);
  }

  async drop(): Promise<any> {
    return this.courseModel.deleteMany({});
  }
}