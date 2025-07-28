import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('courses')
@Controller('students/:studentId/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Param('studentId') studentId: string, @Body() createCourseDto: CreateCourseDto) {
    createCourseDto.student_id = studentId;
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAllForStudent(
    @Param('studentId') studentId: string,
    @Query('name') name: string,
    @Query('score') score: string,
  ) {
    if (name) {
      return this.coursesService.findForStudentByName(studentId, name);
    }
    if (score) {
      return this.coursesService.findForStudentByScore(studentId, +score);
    }
    return this.coursesService.findAllForStudent(studentId);
  }

  @Get('average')
  getStudentAverageScore(@Param('studentId') studentId: string) {
    return this.coursesService.getStudentAverageScore(studentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
