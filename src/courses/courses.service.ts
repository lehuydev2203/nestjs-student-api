import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './schemas/course.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDto);
    return createdCourse.save();
  }

  async findAllForStudent(studentId: string): Promise<Course[]> {
    return this.courseModel.find({ student_id: studentId }).exec();
  }

  async findOne(id: string): Promise<Course | null> {
    return this.courseModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course | null> {
    return this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Course | null> {
    return this.courseModel.findByIdAndDelete(id).exec();
  }

  async findForStudentByName(
    studentId: string,
    name: string,
  ): Promise<Course[]> {
    return this.courseModel
      .find({ student_id: studentId, name: new RegExp(name, 'i') })
      .exec();
  }

  async findForStudentByScore(
    studentId: string,
    score: number,
  ): Promise<Course[]> {
    return this.courseModel
      .find({ student_id: studentId, score: score })
      .exec();
  }

  async getStudentAverageScore(studentId: string): Promise<any> {
    const courses = await this.findAllForStudent(studentId);
    if (courses.length === 0) {
      return { averageScore: 0, classification: 'N/A' };
    }

    const totalScore = courses.reduce((acc, course) => acc + course.score, 0);
    const averageScore = totalScore / courses.length;

    let classification = 'Yếu';
    if (averageScore >= 8) {
      classification = 'Giỏi';
    } else if (averageScore >= 6.5) {
      classification = 'Khá';
    } else if (averageScore >= 5) {
      classification = 'Trung bình';
    }

    return { averageScore, classification };
  }
}
