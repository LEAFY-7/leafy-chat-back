class ModelOptionsClass {
  static get modelOptions() {
    return {
      toJSON: {
        virtuals: true,
        transform: (_: any, obj: any) => {
          // ID 필드 제외
          delete obj._id;
          return obj;
        },
      },
      toObject: {
        virtuals: true,
        transform: (_: any, obj: any) => {
          // ID 필드 제외
          delete obj._id;
          return obj;
        },
      },
      versionKey: false,
      timestamps: true,
    };
  }
}

export default ModelOptionsClass;
