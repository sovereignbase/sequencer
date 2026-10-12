 (func $17 (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (block $block
   (if
    (i32.le_u
     (i32.add
      (i32.shl
       (i32.load offset=12
        (local.get $0)
       )
       (i32.const 2)
      )
      (i32.const 4)
     )
     (i32.mul
      (local.tee $4
       (i32.div_s
        (i32.sub
         (local.tee $11
          (i32.load offset=4
           (local.get $0)
          )
         )
         (local.tee $5
          (i32.load
           (local.get $0)
          )
         )
        )
        (i32.const 12)
       )
      )
      (i32.const 3)
     )
    )
    (then
     (local.set $8
      (i32.sub
       (local.get $4)
       (i32.const 1)
      )
     )
     (local.set $7
      (local.get $5)
     )
     (br $block)
    )
   )
   (block $block1
    (if
     (i32.lt_u
      (local.tee $4
       (i32.shl
        (local.get $4)
        (i32.const 1)
       )
      )
      (i32.const 357913942)
     )
     (then
      (br_if $block1
       (i32.eqz
        (local.tee $7
         (call $1
          (local.tee $12
           (i32.mul
            (select
             (i32.const 64)
             (local.get $4)
             (i32.le_u
              (local.get $4)
              (i32.const 64)
             )
            )
            (i32.const 12)
           )
          )
         )
        )
       )
      )
      (if
       (local.tee $10
        (i32.add
         (i32.sub
          (local.tee $4
           (i32.sub
            (local.get $12)
            (i32.const 12)
           )
          )
          (i32.rem_u
           (local.get $4)
           (i32.const 12)
          )
         )
         (i32.const 12)
        )
       )
       (then
        (memory.fill
         (local.get $7)
         (i32.const 0)
         (local.get $10)
        )
       )
      )
      (local.set $8
       (i32.sub
        (i32.div_s
         (local.get $10)
         (i32.const 12)
        )
        (i32.const 1)
       )
      )
      (if
       (i32.ne
        (local.get $5)
        (local.get $11)
       )
       (then
        (local.set $4
         (local.get $5)
        )
        (loop $label1
         (if
          (i32.load offset=8
           (local.get $4)
          )
          (then
           (local.set $6
            (i32.xor
             (i32.shr_u
              (local.tee $6
               (i32.mul
                (i32.xor
                 (i32.shr_u
                  (local.tee $6
                   (i32.mul
                    (i32.xor
                     (i32.shr_u
                      (local.tee $6
                       (i32.add
                        (i32.load offset=4
                         (local.get $4)
                        )
                        (i32.mul
                         (i32.load
                          (local.get $4)
                         )
                         (i32.const -1640531527)
                        )
                       )
                      )
                      (i32.const 16)
                     )
                     (local.get $6)
                    )
                    (i32.const -2048144789)
                   )
                  )
                  (i32.const 13)
                 )
                 (local.get $6)
                )
                (i32.const -1028477387)
               )
              )
              (i32.const 16)
             )
             (local.get $6)
            )
           )
           (loop $label
            (local.set $6
             (i32.add
              (local.tee $9
               (i32.and
                (local.get $6)
                (local.get $8)
               )
              )
              (i32.const 1)
             )
            )
            (br_if $label
             (i32.load offset=8
              (local.tee $9
               (i32.add
                (local.get $7)
                (i32.mul
                 (local.get $9)
                 (i32.const 12)
                )
               )
              )
             )
            )
           )
           (i32.store offset=8
            (local.get $9)
            (i32.load offset=8
             (local.get $4)
            )
           )
           (i64.store align=4
            (local.get $9)
            (i64.load align=4
             (local.get $4)
            )
           )
          )
         )
         (br_if $label1
          (i32.ne
           (local.tee $4
            (i32.add
             (local.get $4)
             (i32.const 12)
            )
           )
           (local.get $11)
          )
         )
        )
       )
      )
      (if
       (local.get $5)
       (then
        (i32.store offset=4
         (local.get $0)
         (local.get $5)
        )
        (call $0
         (local.get $5)
        )
       )
      )
      (i32.store offset=8
       (local.get $0)
       (i32.add
        (local.get $7)
        (local.get $12)
       )
      )
      (i32.store offset=4
       (local.get $0)
       (i32.add
        (local.get $7)
        (local.get $10)
       )
      )
      (i32.store
       (local.get $0)
       (local.get $7)
      )
      (br $block)
     )
    )
    (call $3)
    (unreachable)
   )
   (call $2)
   (unreachable)
  )
  (block $block2
   (if
    (i32.eqz
     (i32.load offset=8
      (local.tee $6
       (i32.add
        (local.get $7)
        (i32.mul
         (local.tee $5
          (i32.and
           (i32.xor
            (i32.shr_u
             (local.tee $5
              (i32.mul
               (i32.xor
                (i32.shr_u
                 (local.tee $5
                  (i32.mul
                   (i32.xor
                    (i32.shr_u
                     (local.tee $5
                      (i32.add
                       (i32.mul
                        (local.get $1)
                        (i32.const -1640531527)
                       )
                       (local.get $2)
                      )
                     )
                     (i32.const 16)
                    )
                    (local.get $5)
                   )
                   (i32.const -2048144789)
                  )
                 )
                 (i32.const 13)
                )
                (local.get $5)
               )
               (i32.const -1028477387)
              )
             )
             (i32.const 16)
            )
            (local.get $5)
           )
           (local.get $8)
          )
         )
         (i32.const 12)
        )
       )
      )
     )
    )
    (then
     (local.set $4
      (i32.const 1)
     )
     (br $block2)
    )
   )
   (loop $label2
    (block $block3
     (br_if $block3
      (i32.ne
       (i32.load
        (local.get $6)
       )
       (local.get $1)
      )
     )
     (br_if $block3
      (i32.ne
       (i32.load offset=4
        (local.get $6)
       )
       (local.get $2)
      )
     )
     (local.set $4
      (i32.const 0)
     )
     (br $block2)
    )
    (local.set $4
     (i32.const 1)
    )
    (br_if $label2
     (i32.load offset=8
      (local.tee $6
       (i32.add
        (local.get $7)
        (i32.mul
         (local.tee $5
          (i32.and
           (i32.add
            (local.get $5)
            (i32.const 1)
           )
           (local.get $8)
          )
         )
         (i32.const 12)
        )
       )
      )
     )
    )
   )
  )
  (i32.store offset=12
   (local.get $0)
   (i32.add
    (i32.load offset=12
     (local.get $0)
    )
    (local.get $4)
   )
  )
  (i32.store offset=8
   (local.get $6)
   (local.get $3)
  )
  (i32.store offset=4
   (local.get $6)
   (local.get $2)
  )
  (i32.store
   (local.get $6)
   (local.get $1)
  )
 )
