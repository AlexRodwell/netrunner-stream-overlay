<script lang="ts">
	export let code: string;
</script>

<img
	class="w-[50px]"
	src={`https://static.nrdbassets.com/v1/large/{code}.jpg`.replace(
		"{code}",
		code
	)}
/>
