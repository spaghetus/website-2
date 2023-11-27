FROM docker.io/denoland/deno AS deno
RUN cp $(which deno) /deno

FROM docker.io/rust:1.71
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
	apt-get install -y pandoc texlive-latex-recommended && \
	wget -O /tmp/mimic.deb https://github.com/MycroftAI/mimic3/releases/download/release%2Fv0.2.4/mycroft-mimic3-tts_0.2.4_amd64.deb && \
	apt-get install -y /tmp/mimic.deb && \
	rm -rf /var/lib/apt/lists /tmp/mimic.deb
RUN mimic3 --preload-voice en_US/cmu-arctic_low
RUN cargo install nu
RUN cargo install md2gemtext
COPY --from=deno /deno /bin/deno
WORKDIR /wsrc

RUN cargo install --git https://github.com/spaghetus/wwebs --rev 3562156373f5486317afb0c34de3657d764e6397
CMD wwebs -h 8000 --gem-priv /private.pem --gem-pub /public.pem