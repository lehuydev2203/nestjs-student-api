import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './students/schemas/student.schema';
import { Course, CourseSchema } from './courses/schemas/course.schema';
import { StudentsSeeder } from './students/students.seeder';
import { CoursesSeeder } from './courses/courses.seeder';

seeder({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/APIDB'),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
  ],
}).run([StudentsSeeder, CoursesSeeder]);
