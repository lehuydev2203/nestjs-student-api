import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Student } from '../schemas/student.schema';

@Injectable()
export class StudentsSeeder implements Seeder {
  constructor(@InjectModel(Student.name) private readonly studentModel: Model<Student>) {}

  async seed(): Promise<any> {
    const students = [
      {
        name: 'Lê Huy',
        address: '123 Võ Văn Tần, Q.3, TP.HCM',
        phone: '0909123456',
        dob: new Date('2002-05-15'),
      },
      {
        name: 'Trần Thị Bích',
        address: '456 Lê Lợi, Q.1, TP.HCM',
        phone: '0987654321',
        dob: new Date('2003-02-20'),
      },
      {
        name: 'Phạm Văn Cường',
        address: '789 Nguyễn Thị Minh Khai, Q.3, TP.HCM',
        phone: '0912345678',
        dob: new Date('2002-11-30'),
      },
      {
        name: 'Nguyễn Thảo Duyên',
        address: '101 Pasteur, Q.1, TP.HCM',
        phone: '0939888777',
        dob: new Date('2004-01-10'),
      },
      {
        name: 'Võ Hoàng Em',
        address: '212 Lý Chính Thắng, Q.3, TP.HCM',
        phone: '0905555666',
        dob: new Date('2003-08-08'),
      },
    ];

    return this.studentModel.insertMany(students);
  }

  async drop(): Promise<any> {
    return this.studentModel.deleteMany({});
  }
}