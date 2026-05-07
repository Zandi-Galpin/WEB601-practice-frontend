<script>
    let { data } = $props();
</script>

<h1>{data.profile.name}</h1>
<p>{data.profile.email}</p>
<p>{data.profile.location}</p>
<p style="white-space: pre-wrap">{data.profile.bio}</p>