import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Price } from "./schemas/price.schema";
import { PaginationQueryDto } from "src/utils/PaginationDto/pagination-query.dto";
import { PriceDto } from "./dto/price.dto";
@Injectable()
export class PriceService {
  constructor(@InjectModel(Price.name) private readonly priceModel: Model<Price>) {}
  async findAll(paginationQuery: PaginationQueryDto): Promise<Price[]> {
    const { limit, offset } = paginationQuery;
    return (await this.priceModel.find().skip(offset).limit(limit).exec()).filter(
      (price) => price.isDeleted !== true,
    );
  }

  async findOne(id: string): Promise<Price> {
    try {
      const price = await this.priceModel.findOne({ tile_id: id }).exec();
      return price;
    } catch {
      throw new NotFoundException({
        message: "Price cannot be find, please search again",
      });
    }
  }

  async create(createPriceDto: PriceDto): Promise<Price> {
    const price = await this.priceModel.create(createPriceDto);
    return price;
  }

  async update(id: string, priceDto: PriceDto): Promise<Price> {
    try {
      const updatePriceDto = {
        ...priceDto,
        deliveryPrice: priceDto.deliveryPrice,
        tilePrice: priceDto.tilePrice,
      };
      const existingPrice = await this.priceModel
        .findOneAndUpdate(
          { tile_id: id },
          { $set: updatePriceDto, $currentDate: { updatedAt: true } },
          { new: true },
        )
        .exec();
      return existingPrice;
    } catch {
      throw new NotFoundException({
        message: "Price cannot be found, please search again",
      });
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.priceModel.findOneAndUpdate(
        { tile_id: id },
        { $set: { isDeleted: true }, $currentDate: { updatedAt: true } },
      );
      return true;
    } catch {
      return false;
    }
  }
}
