@php
$selectedCollection = $post->category ? $page->categories[$post->category] : null;
@endphp
<div class="card card-row shadow-light-lg mb-6">
    <div class="row no-gutters">
        <div class="col-12">
            @if (count($category) === 0 && $selectedCollection && $selectedCollection->name)
            <a href="/{{ $selectedCollection['slug'] }}">
                <span class="badge badge-pill badge-gray-600 badge-float badge-float-outside">
                    <span class="h6 text-uppercase category-pill">
                    {{ $selectedCollection->name }}
                    </span>
                </span>
            </a>
            @endif
        </div>
        {{-- covers carry their headline: the whole image, nothing laid over it --}}
        <a class="col-12 col-md-6 feature-cover {{ $is_left ? 'order-md-2' : 'order-md-1' }}" href="{{ $post->getUrl() }}" aria-label="{{ $post->title }}">
            <img src="/{{ $post->featured_image }}" alt="{{ $post->title }}" class="img-fluid" loading="lazy" decoding="async">
        </a>
        <div class="col-12 col-md-6 {{ $is_left ? 'order-md-1' : 'order-md-2'  }}">

            <!-- Body -->
            <a class="card-body" href="{{ $post->getUrl() }}">

                <!-- Heading -->
                <h3>
                    {{ $post->title }}
                </h3>

                <!-- Text -->
                <p class="mb-0 text-muted">
                    {{ $post->excerpt ?? '' }}
                </p>

            </a>

            <!-- Meta -->
            <div class="card-meta">

                <!-- Divider -->
                <hr class="card-meta-divider">

                <!-- Author -->
                <p class="h6 text-uppercase text-muted mr-2 mb-0">
                    {{ $post->author }}
                </p>

                <!-- Date -->
                <p class="h6 text-uppercase text-muted mb-0 ml-auto">
                    <time datetime="{{ gmdate('Y-m-d', $post->date) }}">
                        {{ gmdate("d M Y", $post->date) }}
                    </time>
                </p>

            </div>

        </div>

    </div> <!-- / .row -->
</div>