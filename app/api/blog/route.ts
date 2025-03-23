const allowedOrigins = [
  "https://dubaiusedfurniture.ae",
  "http://localhost:3000",
];

function getCorsHeaders(origin: string | null) {
  if (!origin || !allowedOrigins.includes(origin)) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = req.headers.get("origin");

  const category = searchParams.get("category") || null;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const id = searchParams.get("id") || null;

  try {
    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (category) {
      const isValidCategory = await categoriesModel.findOne({ name: category });
      if (!isValidCategory) {
        return NextResponse.json(
          { success: false, message: `Cannot find blog for ${category} category` },
          { headers: getCorsHeaders(origin) }
        );
      }
      query.category = category;
    }

    if (id) {
      const blog = await blogsModel
        .findById({ _id: id })
        .select("-author -slug -createdAt -updatedAt -__v");
      if (!blog) {
        return NextResponse.json(
          { message: "Cannot found blog details", success: false },
          { headers: getCorsHeaders(origin) }
        );
      }
      return NextResponse.json(
        { message: "Blog details fetched!", success: true, data: blog },
        { headers: getCorsHeaders(origin) }
      );
    }

    const skip = (page - 1) * limit;
    const blogs = await blogsModel.find(query).skip(skip).limit(limit);
    const totalBlogs = await blogsModel.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        message: "Blogs fetched successfully!",
        data: blogs,
        pagination: {
          total: totalBlogs,
          page,
          limit,
          totalPages: Math.ceil(totalBlogs / limit),
        },
      },
      { headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Error fetching blogs ::", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch blogs, server error",
      },
      { headers: getCorsHeaders(origin) }
    );
  }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const data: blogData = await req.json();

  try {
    await dbConnect();
    const newBlog = new blogsModel(data);
    await newBlog.save();
    return NextResponse.json(
      { success: true, message: "Blog created successfully" },
      { headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Blog Creating Error ::", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create blog, server error",
      },
      { headers: getCorsHeaders(origin) }
    );
  }
}

export async function PUT(req: NextRequest) {
  const origin = req.headers.get("origin");
  const data = await req.json();

  try {
    await dbConnect();
    await blogsModel.findByIdAndUpdate(
      { _id: data.id },
      {
        title: data.title,
        caption: data.caption,
        seo: {
          metaTitle: data.seo.metaTitle,
          metaDescription: data.seo.metaDescription,
        },
        category: data.category,
        content: data.content,
        FeaturedImage: data.FeaturedImage,
      },
      { new: true }
    );
    return NextResponse.json(
      { message: "Blog updated successfully", success: true },
      { headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Blog updating error", error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to update - server error",
        success: false,
      },
      { headers: getCorsHeaders(origin) }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const origin = req.headers.get("origin");
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { success: false, message: "No id received" },
      { headers: getCorsHeaders(origin) }
    );
  }

  try {
    await dbConnect();
    await blogsModel.findByIdAndDelete({ _id: id });
    return NextResponse.json(
      { success: true, message: "Deleted successfully" },
      { headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Error deleting blog ::", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete blog, server error",
      },
      { headers: getCorsHeaders(origin) }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return NextResponse.json(
    {},
    {
      headers: getCorsHeaders(origin),
    }
  );
}

